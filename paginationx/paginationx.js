/**
 * paginationx version 0.9
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 *
 * @preserve
 */
'use strict';

var paginationX = angular.module('paginationX', []);


paginationX.directive('paginationX', ['$filter', '$compile', paginationXDirective]);

/**
 * The directive function for paginationX directive. This directive should be used only as an element. It has it's own isolate scope.
 *
 * @param  {$filter}
 * @param  {$compile}
 * @return { Directive Definition Object}
 */
function paginationXDirective($filter, $compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			// 1. Text attributes
			id: '@',
			sortBy: '@',
			// 2. Two-way bound attributes
			features: '=',
			list: '=',
			columns: '=',
			paginationX: '=', // API object for the directive
			exportOptions: '=',
			pageSizeOptions: '=',
			toolbarOptions: '=',
			actionColumnOptions: '=',
			actionHandlers: '='
		},
		templateUrl: './paginationx/paginationx.html',
		link: linkFn
	};

	/**
	 * LinkFn - The Link function for the paginationX directive. This creates the table dynamically and replces the <table></table>
	 * element in the directive's template using the $compile service. This way, number of watchers is reduced considerably
	 * and performance is far better then it would be if ng-repeat is used for table creation.
	 *
	 * @param      {<type>}	scope   The scope
	 * @param      {<type>} elem    The element
	 * @param      {<type>} attrs   The attributes
	 */
	function linkFn(scope, elem, attrs) {
		/**
		 * sort - Function to sort data displayed when user clicks on a table header.
		 * @param  {[String]} keyName [Name of the json attribute name to sort.]
		 */
		scope.sort = function(keyName) {
			scope.sortOrder = !scope.sortOrder;
			scope.sortKey = keyName;
			scope.listForDisplay = $filter('orderBy')(scope.listForDisplay, keyName, scope.sortOrder);
			scope.setPage(scope.paginationX.currentPage);
		}

		/**
		 * setPage - Function that sets the page when user changes page using the navigation toolbar.
		 * @param {[type]} pageNumber [Number of page to be displayed]
		 */
		scope.setPage = function(pageNumber) {
			if (scope.actionHandlers && scope.actionHandlers.changePage) {
				if (attrs['paginationX'] === undefined) {
					throw 'Please add pagination-x attribute to use the external handler for page change event.';
				}
				scope.paginationX.newPageNumber = pageNumber;
				var externalHandler = scope.actionHandlers.changePage;
				externalHandler();
			} else {
				scope.paginationX.setPage(pageNumber);
			}
			scope.paginationX.selectAll = isPageSelected();
			setTable();
		}

		var getPage = function(list, pageNumber) {
			var page = [];
			scope.paginationX.startIndex = ((pageNumber - 1) * scope.paginationX.pageSize);
			scope.paginationX.endIndex = (pageNumber * scope.paginationX.pageSize) > list.length ? list.length : (pageNumber * scope.paginationX.pageSize);
			page = list.slice(scope.paginationX.startIndex, scope.paginationX.endIndex);
			return page;
		}

		var setTable = function() {
			var element = angular.element('#'+scope.id+' table');
			var compiled = $compile(getTemplate())(scope);
			var oldelement = element;
			element.replaceWith(compiled);
		}

		var getTemplate = function() {
			var table = '<table id=table_' + scope.id + ' class="table table-striped table-hover border-custom-class-table" >';
			table = table + getTHeader(scope.columns);
			table = table + getTBody(scope.columns);
			table = table + '</table>';

			return table;
		}

		var getTHeader = function(columns) {
			var tableHeader = '<thead class="tablestrip-bgcolor"> <tr>';
			if (scope.features.selectColumn) {
				var checked = (scope.paginationX.selectAll === undefined || scope.paginationX.selectAll === false) ? '' : 'checked';
				tableHeader = tableHeader + '<th class="select-column-header" width="10px"> <input type="checkbox" name="selectAll" ng-click="handlePageSelection()" ' + checked + '></th>';
			}
			for (var j = 0; j < columns.length; j++) {
				tableHeader = tableHeader + '<th ng-click="sort(\'' + columns[j].sortKey + '\')" width="' + columns[j].width + '" style="' + columns[j].style + '">' + columns[j].title;
				if (scope.sortKey === columns[j].sortKey) {
					if (scope.sortOrder === true) {
						tableHeader = tableHeader + '&nbsp <span class="glyphicon glyphicon-chevron-up"></span>';
					} else {
						tableHeader = tableHeader + '&nbsp <span class="glyphicon glyphicon-chevron-down"></span>';
					}
				}
				tableHeader = tableHeader + '</th>';
			}
			if (scope.features.actionColumn) {
				var actionColumnName = scope.actionColumnOptions.title !== undefined ? scope.actionColumnOptions.title : "Actions";
				tableHeader = tableHeader + '<th class="action-column-header" width="' + scope.actionColumnOptions.colWidth + '">' + actionColumnName + '</th>';
			}
			tableHeader = tableHeader + '</tr></thead>';
			return tableHeader;
		}

		var getTBody = function(columns) {
			var tableBody = '<tbody>';
			for (var i = 0; i < scope.page.length; i++) {
				var obj = scope.page[i];
				tableBody = tableBody + '<tr>';
				if (scope.features.selectColumn && (obj.selectable === undefined || obj.selectable === true)) {
					var checked = (obj.selected === undefined || obj.selected === false) ? '' : 'checked';
					tableBody = tableBody + '<td width="10px"><input type="checkbox" ng-click="handleRecordSelection(page[' + i + '])" ' + checked + '></td>';
				} else if (scope.features.selectColumn) {
					tableBody = tableBody + '<td width="10px"></td>';
				}
				for (var j = 0; j < columns.length; j++) {
					var columnStyle = columns[j].style === undefined ? '' : columns[j].style;
					var cellStyle = obj[columns[j].dataKey + 'Style'] === undefined ? '' : obj[columns[j].dataKey + 'Style'];
					tableBody = tableBody + '<td width="' + columns[j].width + '" style="' + columnStyle + cellStyle + '">' + obj[columns[j].dataKey] + '</td>';
				}
				if (scope.features.actionColumn) {
					tableBody = tableBody + getActionColumn(obj.actions, i);
				}
				tableBody = tableBody + '</tr>';
			}
			tableBody = tableBody + '</tbody>';
			return tableBody;
		}

		var getActionColumn = function(rowActions, index) {
			var actionColumn = '';
			var options = scope.actionColumnOptions;
			var actions = (rowActions === undefined) ? options.actions : rowActions;
			if (actions === undefined || actions.length === 0) {
				actionColumn = '<td width="' + options.colWidth + '" ' + options.htmlAttrbs + '></td>';
				return actionColumn;
			}

			actionColumn = actionColumn + '<td width="' + options.colWidth + '" ' + options.htmlAttrbs + '>';
			for (var i = 0; i < actions.length; i++) {
				if (actions[i].type === undefined || actions[i].type === "Button") {
					actionColumn = actionColumn + '<button ' + actions[i].htmlAttrbs + ' ng-click="actionHandler(\'' + actions[i].name + '\',page[' + index + '])" ' + actions[i].status + '>' + actions[i].name + '</button>&nbsp';
				} else if (actions[i].type === "Link") {
					actionColumn = actionColumn + '<a ' + actions[i].htmlAttrbs + ' href="' + actions[i].href + '" ng-click="actionHandler(\'' + actions[i].name + '\',page[' + index + '])" ' + actions[i].status + '>' + actions[i].name + '</a>&nbsp';
				}
			}
			actionColumn = actionColumn + '</td>';
			return actionColumn;
		}

		/**
		 * actionHandler - Function to invoke the handler function, in the controller for the page in which the directive is used, for
		 * the action user takes (by clicking the button/link in the action column, if present).
		 *
		 * @param  {String} action [Name of the action button/link clicked by user.]
		 * @param  {Object} object [The object for the row displayed in the table on screen.]
		 */
		scope.actionHandler = function(action, object) {
			if (scope.actionHandlers && scope.actionHandlers[action]) {
				var actionHandler = scope.actionHandlers[action];
				actionHandler(object);
			}
		}

		/**
		 * changePageSize - Function to handle page size change event. If a handler name (for a function in the controller) is passed
		 * as the value of 'sizeChangeHandler' attribute of the directive, it is called. Otherwise, the event is handled by this method.
		 */
		scope.changePageSize = function() {
			if (scope.actionHandlers && scope.actionHandlers.changePageSize) {
				if (attrs['paginationX'] === undefined) {
					throw 'Please add pagination-x attribute to use the external handler for page size change event.';
				}
				var externalHandler = scope.actionHandlers.changePageSize;
				externalHandler();
			} else {
				scope.paginationX.changePageSize();
				scope.setPageLinks(1);
			}
		}

		/**
		 * searchFn - Function to handle search event. If a handler name (for a function in the controller) is passed
		 * as the value of 'sizeChangeHandler' attribute of the directive, it is called. Otherwise, the event is handled by this method.
		 *
		 * This function searches only the searchable columns (by default all displayed columns are searchable).
		 *
		 * @return {[type]} [description]
		 */
		scope.searchFn = function() {
			if (scope.actionHandlers && scope.actionHandlers.search) {
				var externalHandler = scope.actionHandlers.search;
				if (attrs['paginationX'] === undefined) {
					throw 'Please add pagination-x attribute to use the external handler for search event.'
				}
				externalHandler();
			} else {
				scope.paginationX.searchFn();
			}
		}

		/**
		 * handlePageSelection - Function to handle page selection event (when user clicks the checkbox, the global checkbox in the
		 * table header in the checkbox column, if present). This selects all selectable rows in the table on the current page.
		 */
		scope.handlePageSelection = function() {
			scope.paginationX.selectAll = !scope.paginationX.selectAll;
			toggleSelection(getPage(scope.listForDisplay, scope.paginationX.currentPage));
			setTable();
		}

		var toggleSelection = function(list) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].selectable === undefined || list[i].selectable === true) {
					list[i].selected = scope.paginationX.selectAll;
				}
			}
		}

		var isPageSelected = function() {
			var curPage = getPage(scope.listForDisplay, scope.paginationX.currentPage);
			var isPageSelected = (curPage.length > 0) ? true : false;
			for (var i = 0; i < curPage.length; i++) {
				if ((curPage[i].selected === undefined || curPage[i].selected === false) && (curPage[i].selectable === undefined || curPage[i].selectable === true)) {
					isPageSelected = false;
					break;
				}
			}
			return isPageSelected;
		}

		/**
		 * handleRecordSelection - Function to handle record selection event (when user clicks a checkbox on a row, if present).
		 * @param  {Object} object [Object for the row.]
		 */
		scope.handleRecordSelection = function(object) {
			object.selected = !object.selected;
			scope.paginationX.selectAll = isPageSelected();
			setTable();
		}

		/**
		 * setPageLinks - Function to set page links in the nagivation toolbar. Page links are displayed if only 'toolbarType' is 'link'
		 * in the 'toolbarOptions'.
		 *
		 * @param {Number} startPage [The start page of next set of links is passed as argument from browser when user clicks for
		 *                           next/previous set of navigation links (buttons .> or <.)]
		 */
		scope.setPageLinks = function(startPage) {
			if ((startPage === 1) || (startPage > 1) && (startPage <= scope.paginationX.totalPages)) {
				scope.toolbarOptions.startPage = startPage;
				scope.toolbarOptions.links = [];
				for (var i = 0; i < scope.toolbarOptions.linkSize; i++) {
					if ((i + startPage) > scope.paginationX.totalPages) {
						break;
					} else {
						scope.toolbarOptions.links[i] = (i + startPage);
					}
				}
			}
		}

		/***************************************************** External API secion starts **************************************************************/
		var searchFn = function() {
			var filteredList = [];
			if (scope.paginationX.search && scope.paginationX.search.trim().length > 0) {
				for (var i = 0; i < scope.list.length; i++) {
					var object = scope.list[i];
					for (var j = 0; j < scope.searchableColumns.length; j++) {
						if ((object[scope.searchableColumns[j]] + '').toLowerCase().includes(scope.paginationX.search.toLowerCase())) {
							filteredList.push(object);
							break;
						}
					}
				}
				scope.listForDisplay = filteredList;
			} else {
				scope.listForDisplay = scope.list;
			}
			scope.changePageSize();
		}

		var changePageSize = function() {
			scope.paginationX.totalPages = Math.ceil(scope.listForDisplay.length / scope.paginationX.pageSize);
			scope.setPage(1);
		}

		var setPage = function(pageNumber) {
			if (scope.listForDisplay.length === 0) {
				scope.page = [];
				return;
			} else if (pageNumber && pageNumber >= 1 && pageNumber <= scope.paginationX.totalPages) {
				scope.paginationX.currentPage = pageNumber;
				scope.paginationX.goToPage = pageNumber;
				scope.page = getPage(scope.listForDisplay, pageNumber);
			}
			scope.selectAll = isPageSelected();
		}

		var getSelectedRecords = function() {
			var selectedRecords = [];
			angular.forEach(scope.list, function(object, index) {
				if (object.selected && object.selected === true) {
					selectedRecords.push(object);
				}
			});
			/* The comment below will help debug quickly. Do not delete. */
			/*console.log('number of selected records = '+selectedRecords.length);
			angular.forEach(selectedRecords,function(object, index) {
				console.log(object.empId+' | '+object.firstName);
			});*/

			return selectedRecords;
		}

		var getCurrentPageRecords = function() {
			return scope.page;
		}

		var load = function(list) {
			scope.list = list;
			init();
		}

		/***************************************************** External API secion ends **************************************************************/

		/***************************************************** Export section starts **************************************************************/
		/**
		 * export - Function to export table data to .xlsx file.
		 * @param  {String} option [Export options]
		 */
		scope.export = function(option) {
			if (option.type === 'pdf') {
				exportToPdf(option);
			} else if (option.type === 'excel') {
				exportToExcel(option);
			}
		}

		var exportToPdf = function(option) {
			var doc = new jsPDF('p', 'pt');
			doc.autoTable(option.columns, getRecordsForExport(option), option.style);
			doc.text(option.header, 40, 30);
			doc.save(option.fileName);
		}

		var exportToExcel = function(option) {
			alasql(getExcelExportQuery(option), [getRecordsForExport(option)]);
		}

		var getExcelExportQuery = function(option) {
			var selectClause = '';
			var columns = option.columns;
			for (var i = 0; i < columns.length; i++) {
				if ((i + 1) === columns.length) {
					selectClause = selectClause + columns[i].dataKey + ' AS [' + columns[i].title + ']'
				} else {
					selectClause = selectClause + columns[i].dataKey + ' AS [' + columns[i].title + '],'
				}
			}
			var query = 'SELECT ' + selectClause + ' INTO XLSX("' + option.fileName + '.xlsx",{headers:true}) FROM ?';
			return query;
		}

		var getRecordsForExport = function(option) {
			var recordsForExport = [];
			if (option.records === 'selected') {
				if (scope.paginationX.getSelectedRecords().length > 0) {
					recordsForExport = scope.paginationX.getSelectedRecords();
				} else {
					recordsForExport = scope.listForDisplay;
				}
			} else if (option.records === 'all') {
				recordsForExport = scope.list;
			} else if (option.records === 'page') {
				recordsForExport = scope.page;
			}
			return recordsForExport;
		}
		/***************************************************** Export section ends **************************************************************/

		/***************************************************** Initialization section starts ****************************************************/
		var addApi = function() {
			scope.paginationX = (scope.paginationX === undefined) ? {} : scope.paginationX;
			scope.paginationX.searchFn = searchFn;
			scope.paginationX.changePageSize = changePageSize;
			scope.paginationX.setPage = setPage;
			scope.paginationX.getSelectedRecords = getSelectedRecords;
			scope.paginationX.getCurrentPageRecords = getCurrentPageRecords;
			scope.paginationX.load = load;
		}

		var init = function() {
			setPageSizeOptions();
			scope.listForDisplay = initSort(scope.list);
			setSearchableColumns();
			scope.paginationX.totalPages = Math.ceil(scope.list.length / scope.paginationX.pageSize);
			setActionColumnOptions();
			setExportOptions();
			scope.setPage(1);
			setToolbarOptions();
		}

		var initSort = function(listToSort) {
			if (scope.sortBy && scope.sortBy.length >0) {
				var sortKeys = scope.sortBy.split(',');
				return $filter('orderBy')(listToSort,sortKeys,false);
			} else {
				return listToSort;
			}

		}

		var setActionColumnOptions = function() {
			scope.actionColumnOptions = (scope.actionColumnOptions === undefined) ? {} : scope.actionColumnOptions;
			scope.actionColumnOptions.width = (scope.actionColumnOptions.width === undefined) ? "" : scope.actionColumnOptions.width;
			scope.actionColumnOptions.width = (scope.actionColumnOptions.id === undefined) ? "" : scope.actionColumnOptions.id;
			scope.actionColumnOptions.width = (scope.actionColumnOptions.class === undefined) ? "" : scope.actionColumnOptions.class;
		}

		var setToolbarOptions = function() {
			scope.toolbarOptions = (scope.toolbarOptions === undefined) ? {} : scope.toolbarOptions;
			scope.toolbarOptions.toolbarType = (scope.toolbarOptions.toolbarType === undefined) ? "textbox" : scope.toolbarOptions.toolbarType;
			scope.toolbarOptions.linkSize = (scope.toolbarOptions.linkSize === undefined) ? 5 : scope.toolbarOptions.linkSize;
			scope.setPageLinks(1);
		}

		/** Except those columns in the column definition (passed to columns attribute) that has 'searchable' set to 'No', all
			other columns are searchable **/
		var setSearchableColumns = function() {
			scope.searchableColumns = [];
			for (var i = 0; i < scope.columns.length; i++) {
				if (scope.columns[i].searchable === undefined || scope.columns[i].searchable) {
					scope.searchableColumns.push(scope.columns[i].sortKey);
				}
			}
		}

		var setExportOptions = function() {
			if (scope.exportOptions === undefined) {
				scope.exportOptions = getDefaultExportOptions();
			} else {
				for (var i = 0; i < scope.exportOptions.length; i++) {
					if (scope.exportOptions[i].records === undefined) {
						scope.exportOptions[i].records = 'selected';
					}
					if (scope.exportOptions[i].columns === undefined) {
						scope.exportOptions[i].columns = (scope.exportOptions[i].type === 'pdf') ? getPdfExportColumns() : null;
					}
					if (scope.exportOptions[i].style === undefined) {
						scope.exportOptions[i].style = (scope.exportOptions[i].type === 'pdf') ? defaultPdfExportStyle : null;
					}
					if (scope.exportOptions[i].header === undefined) {
						scope.exportOptions[i].header = (scope.exportOptions[i].type === 'pdf') ? 'Report' : '';
					}
					scope.exportOptions[i].records = (scope.exportOptions[i].records === undefined) ? "selected" : scope.exportOptions[i].records;
				}
			}
		}

		var getDefaultExportOptions = function() {
			var pdfExportColumns = getPdfExportColumns();
			return [{
				type: "pdf",
				records: "selected",
				columns: pdfExportColumns,
				fileName: "PdfReport",
				header: "Report",
				buttonName: "Pdf",
				style: defaultPdfExportStyle
			}, {
				type: "excel",
				records: "selected",
				columns: scope.columns,
				fileName: "ExcelReport",
				buttonName: "XL"
			}, ];
		}

		var defaultPdfExportStyle = {
			styles: {
				overflow: 'linebreak'
			},
			columnStyles: {
				id: { fillColor: 255 }
			},
			margin: {
				top: 60
			}
		};

		var getPdfExportColumns = function() {
			var pdfExportColumns = [];
			for (var i = 0; i < scope.columns.length; i++) {
				var exportColumn = {};
				exportColumn.title = scope.columns[i].title;
				exportColumn.dataKey = scope.columns[i].dataKey;
				pdfExportColumns.push(exportColumn);
			}
			return pdfExportColumns;
		}

		var setPageSizeOptions = function() {
			scope.pageSizeOptions = (scope.pageSizeOptions === undefined) ? {} : scope.pageSizeOptions;
			scope.pageSizeOptions.pageSizeMenu = (scope.pageSizeOptions.pageSizeMenu === undefined)
				? ['5', '10', '15', '25', '50'] : scope.pageSizeOptions.pageSizeMenu;
			scope.pageSizeOptions.defaultSize = (scope.pageSizeOptions.defaultSize === undefined) ? 10 : scope.pageSizeOptions.defaultSize;
			scope.paginationX.pageSize = scope.pageSizeOptions.defaultSize;
		}

		//validate();
		addApi();

		if (scope.list && scope.list.length > 0) {
			// If list is static, initialize the directive
			init();
		}
		/***************************************************** Initialization section starts ****************************************************/
	}; // LinkFn function ends

}
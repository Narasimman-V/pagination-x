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
			setTBody();
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
			element.replaceWith(compiled);
		}

		var setTBody = function() {
			var element = angular.element('#'+scope.id+' tbody');
			var compiled = $compile(getTBody(scope.columns))(scope);
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
			var tableHeader = '<thead id=thead_' + scope.id + 'class="tablestrip-bgcolor"> <tr>';
			if (scope.features.selectColumn) {
				tableHeader = tableHeader + '<th class="select-column-header pagination-header" width="10px"> <div> <input type="checkbox" ng-model="paginationX.selectAll" name="selectAll" ng-click="handlePageSelection()"></div></th>';
			}
			for (var j = 0; j < columns.length; j++) {
				tableHeader = tableHeader + '<th class="pagination-header" width="' + columns[j].width + '" style="' + columns[j].style + '"> <div ng-click="sort(\'' + columns[j].sortKey + '\')">' + columns[j].title;
				tableHeader = tableHeader + '&nbsp <span ng-show="sortKey == \'' + columns[j].sortKey + '\'" ng-class="{\'glyphicon glyphicon-chevron-up\':sortOrder, \'glyphicon glyphicon-chevron-down\':!sortOrder}"></span>';
				tableHeader =  tableHeader + '</div></th>';
			}
			if (scope.features.actionColumn) {
				var actionColumnName = scope.actionColumnOptions.title !== undefined ? scope.actionColumnOptions.title : "Actions";
				tableHeader = tableHeader + '<th class="action-column-header pagination-header" width="' + scope.actionColumnOptions.colWidth + '"> <div>' + actionColumnName + '</div></th>';
			}
			tableHeader = tableHeader + '</tr>';

			if (scope.features.columnSearch) {
				tableHeader = tableHeader + '<tr ng-show="showColumnSearch">';
				tableHeader =  (scope.features.selectColumn) ? tableHeader + '<th></th>' : tableHeader;
				for (var j = 0; j < columns.length; j++) {
					var searchKey = scope.columns[j].searchKey || scope.columns[j].dataKey;
					tableHeader = tableHeader + '<th class="pagination-header" width="' + columns[j].width + '" style="' + columns[j].style + '">';
					tableHeader = (columns[j].searchable === undefined || columns[j].searchable) ? tableHeader + '<input type="text" ng-model="columnSearchText.' + searchKey + '" ng-change="columnSearch()" class="column-search-textbox active"/></th>' : tableHeader + '</th>';
				}
				tableHeader =  (scope.features.actionColumn) ? tableHeader + '<th></th>' : tableHeader;
				tableHeader = tableHeader + '</tr>';
			}
			tableHeader = tableHeader + '</thead>';
			return tableHeader;
		}

		var getTBody = function(columns) {
			var tableBody = '<tbody id="tbody_' + scope.id + '">';
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
					tableBody = tableBody + '<td width="' + columns[j].width + '" style="' + columnStyle + '" class="' + cellStyle + '">' + obj[columns[j].dataKey] + '</td>';
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
		 * search - Function to handle search event. If a handler name (for a function in the controller) is passed
		 * as the value of 'sizeChangeHandler' attribute of the directive, it is called. Otherwise, the event is handled by this method.
		 *
		 * This function searches only the searchable columns (by default all displayed columns are searchable).
		 *
		 * @return {[type]} [description]
		 */
		scope.search = function() {
			if (scope.actionHandlers && scope.actionHandlers.search) {
				var externalHandler = scope.actionHandlers.search;
				if (attrs['paginationX'] === undefined) {
					throw 'Please add pagination-x attribute to use the external handler for search event.'
				}
				externalHandler();
			} else {
				scope.paginationX.search();
			}
		}

		/**
		 * handlePageSelection - Function to handle page selection event (when user clicks the checkbox, the global checkbox in the
		 * table header in the checkbox column, if present). This selects all selectable rows in the table on the current page.
		 */
		scope.handlePageSelection = function() {
			if (scope.actionHandlers && scope.actionHandlers.selectPage) {
				var externalHandler = scope.actionHandlers.selectPage;
				if (attrs['paginationX'] === undefined) {
					throw 'Please add pagination-x attribute to use the external handler for page selection event.'
				}
				externalHandler();
			} else {
				scope.paginationX.handlePageSelection();
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
			if (scope.actionHandlers && scope.actionHandlers.selectRecord) {
				var externalHandler = scope.actionHandlers.selectRecord;
				if (attrs['paginationX'] === undefined) {
					throw 'Please add pagination-x attribute to use the external handler for record selection event.'
				}
				externalHandler(object);
			} else {
				scope.paginationX.handleRecordSelection(object);
			}
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

		scope.toggleColumnSearch = function() {
			scope.showColumnSearch = !scope.showColumnSearch;
		}

		scope.columnSearch = function() {
			clearGlobalSearchText();
			scope.listForDisplay = scope.list;
			var filteredList = [];
			for (var i = 0; i < scope.searchableColumns.length; i++) {
				var property = scope.searchableColumns[i];
				if (scope.columnSearchText[property]) {
					scope.listForDisplay = searchByColumn(property);
				}
			}
			scope.changePageSize();
			setTBody();
		}

		var searchByColumn = function(property) {
			var criterion = {};
			criterion[property] = scope.columnSearchText[property];
			return $filter('filter')(scope.listForDisplay, criterion);
		}

		/**
		 * Call this function when global search is triggered by user. If both search options are set enabled, only one will be active at a time.
		 */
		var clearColumnSearchCriteria = function() {
			for (var i = 0; i < scope.searchableColumns.length; i++) {
				var property = scope.searchableColumns[i];
				if (scope.columnSearchText && scope.columnSearchText[property]) {
					scope.columnSearchText[property] = '';
				}
			}
		}

		/**
		 * Call this function when column search is triggered by user. If both search options are set enabled, only one will be active at a time.
		 */
		var clearGlobalSearchText = function() {
			if (scope.paginationX.searchText) {
				scope.paginationX.searchText = '';
			}
		}

		/***************************************************** External API secion starts **************************************************************/
		var search = function() {
			clearColumnSearchCriteria();
			var filteredList = [];
			if (scope.paginationX.searchText && scope.paginationX.searchText.trim().length > 0) {
				for (var i = 0; i < scope.list.length; i++) {
					var object = scope.list[i];
					for (var j = 0; j < scope.searchableColumns.length; j++) {
						if ((object[scope.searchableColumns[j]] + '').toLowerCase().includes(scope.paginationX.searchText.toLowerCase())) {
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
			setTBody();
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

		var handlePageSelection = function() {
			toggleSelection(getPage(scope.listForDisplay, scope.paginationX.currentPage));
			setTBody();
		}

		var toggleSelection = function(list) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].selectable === undefined || list[i].selectable === true) {
					list[i].selected = scope.paginationX.selectAll;
				}
			}
		}

		var handleRecordSelection = function(object) {
			object.selected = !object.selected;
			scope.paginationX.selectAll = isPageSelected();
			setTBody();
		}

		var load = function(list) {
			scope.list = list;
			init();
			setTable();
		}

		var reload = function(list) {
			scope.list = list;
			init();
			setTBody();
			clearColumnSearchCriteria();
			clearGlobalSearchText();
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
				var exportKey = columns[i].exportKey || columns[i].dataKey;
				if ((i + 1) === columns.length) {
					selectClause = selectClause + exportKey + ' AS [' + columns[i].title + ']'
				} else {
					selectClause = selectClause + exportKey + ' AS [' + columns[i].title + '],'
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
			scope.paginationX.search = search;
			scope.paginationX.changePageSize = changePageSize;
			scope.paginationX.setPage = setPage;
			scope.paginationX.getSelectedRecords = getSelectedRecords;
			scope.paginationX.getCurrentPageRecords = getCurrentPageRecords;
			scope.paginationX.handlePageSelection = handlePageSelection;
			scope.paginationX.handleRecordSelection = handleRecordSelection
			scope.paginationX.load = load;
			scope.paginationX.reload = reload;
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
			scope.showColumnSearch = scope.features.columnSearch ? scope.features.columnSearch : false;
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
			if (scope.toolbarOptions.toolbarType === 'link') {
				scope.setPageLinks(1);
			}
		}

		/** Except those columns in the column definition (passed to columns attribute) that has 'searchable' set to 'No', all
			other columns are searchable **/
		var setSearchableColumns = function() {
			scope.searchableColumns = [];
			for (var i = 0; i < scope.columns.length; i++) {
				if (scope.columns[i].searchable === undefined || scope.columns[i].searchable) {
					if (scope.columns[i].searchKeys === undefined) {
						scope.searchableColumns.push(scope.columns[i].sortKey);
					} else {
						var searchKeys = scope.columns[i].searchKeys.split(",");
						for (var i = 0; i < searchKeys.length; i++) {
							scope.searchableColumns.push(searchKeys[i]);
						}
					}

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
			margin: {
				top: 60
			}
		};

		var getPdfExportColumns = function() {
			var pdfExportColumns = [];
			for (var i = 0; i < scope.columns.length; i++) {
				var exportColumn = {};
				exportColumn.title = scope.columns[i].title;
				exportColumn.dataKey = scope.columns[i].exportKey || scope.columns[i].dataKey;
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
			load(scope.list);
		}
		/***************************************************** Initialization section starts ****************************************************/
	}; // LinkFn function ends

}
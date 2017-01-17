'use strict';

hrapp.controller('HRAppController',['$scope','$rootScope','$http','$q','$location','$filter',function($scope, $rootScope, $http, $q, $location, $filter ) {

	$scope.features = {"selectColumn":true, "search":true, "pageSize":true, "paginationText":true, "export":true, "actionColumn":true};

	$scope.pagination = {};

	$scope.pageSizeOptions = { pageSizeMenu:['5','10','15','25','50','100'], defaultSize:'5'};

	$scope.toolbarOptions = {toolbarType:"link", linkSize:10};

	$scope.columns = [
		{title:"SNo",dataKey:"Sno",sortKey:"Sno",width:"6%"},
		{title:"First Name",dataKey:"firstname",sortKey:"firstname",width:"10%"},
		{title:"Last Name",dataKey:"lastname",sortKey:"lastname",width:"10%"},
		{title:"Designation",dataKey:"jobtitle",sortKey:"jobtitle",width:"17%"},
		{title:"County",dataKey:"county",sortKey:"county",width:"10%",searchable:false},
		{title:"City",dataKey:"city",sortKey:"city",width:"10%"},
		{title:"Email",dataKey:"email",sortKey:"email",width:"14%",style:"overflow-wrap: break-word;word-wrap: break-word; word-break: break-all;"},
		{title:"Mobile",dataKey:"mobile",sortKey:"mobile",width:"10%"}
	];

	$scope.actionColumnOptions = {
		title:"Actions",
		colWidth:"13%",
		htmlAttrbs:'id="act-col-id" class="act-col-class"',
		actions:[{name:"Edit", type:"Button", htmlAttrbs:'id="bt-edit" class="bt-edit-class"'},{name:"Delete", type:"Link", href:"test.html", htmlAttrbs:'id="lnk-del-id" class="lnk-del-class"'}]
	};

	var pdfExportColumns = [
		{title: "SNo", dataKey: "Sno"},
		{title: "First Name", dataKey: "firstname"},
		{title: "Last Name", dataKey: "lastname"},
		{title: "Department", dataKey: "jobtitle"},
		{title: "City", dataKey: "city"},
		{title: "County", dataKey: "county"},
		{title: "Mobile", dataKey: "mobile"},
		{title: "Email", dataKey: "email"}
	];

	var excelExportColumns = [
		{title: "SNo", dataKey: "Sno"},
		{title: "First Name", dataKey: "firstname"},
		{title: "Last Name", dataKey: "lastname"},
		{title: "Job Title", dataKey: "jobtitle"},
		{title: "City", dataKey: "city"},
		{title: "County", dataKey: "county"},
		{title: "Mobile", dataKey: "mobile"},
		{title: "Email", dataKey: "email"}
	];

	var pdfExportStyle ={
		styles: { fillColor: [100, 255, 255],overflow: 'linebreak'},
		columnStyles: {id: {fillColor: 255} },
		margin: {top: 60},
	};

	$scope.exportOptions = [
		{type:"pdf",records:"page",columns:pdfExportColumns,fileName:"Employee-Roster-Report",buttonName:"PdfPage",style:pdfExportStyle,header:'Employee Report'},
		{type:"pdf",records:"all",columns:pdfExportColumns,fileName:"Employee-Roster-Report",buttonName:"PdfAll",style:pdfExportStyle,header:'Employee Report'},
		{type:"pdf",records:"selected",columns:pdfExportColumns,fileName:"Employee-Roster-Report",buttonName:"Pdf",style:pdfExportStyle,header:'Employee Report'},
		{type:"excel",records:"page",columns:excelExportColumns,fileName:"EmployeeRoster",buttonName:"XLPage"},
		{type:"excel",records:"all",columns:excelExportColumns,fileName:"EmployeeRoster",buttonName:"XLAll"},
		{type:"excel",records:"selected",columns:excelExportColumns,fileName:"EmployeeRoster",buttonName:"XL"},
	];

	$scope.getSelectedRecords = function() {
		var list = $scope.pagination.getSelectedRecords();
		console.log('Number of records selected by you: '+list.length+'. They are: \n');
		for (var i=0; i < list.length; i++ ) {
			console.log(JSON.stringify(list[i]));
		}
	}

	$scope.printCurrentPage = function() {
		var list = $scope.pagination.getCurrentPageRecords();
		console.log('Records in current page: '+list.length+'. They are: \n');
		for (var i=0; i < list.length; i++ ) {
			console.log(JSON.stringify(list[i]));
		}
	}

	$scope.editEmployee = function(emp) {
		console.log('editEmployee in controller called for employee: '+emp.firstname+' '+emp.lastname);
	}

	$scope.deleteEmployee = function(emp) {
		console.log('deleteEmployee in controller called for employee: '+emp.firstname+' '+emp.lastname);
	}

	$scope.actionHandlers = {"Edit":$scope.editEmployee,"Delete":$scope.deleteEmployee};

	$scope.employees = [
		//{"Sno":1,"firstname":"Michelle","lastname":"Fisher","jobtitle":"HRD/Training and Development Administrator","county":'<span style="color:red;">Summerbush</span>',"city":"East Pepperell","email":"michelle.fisher@kmail.com","mobile":815231416,selectable:false,actions:[{name:"Edit", type:"Button", htmlAttrbs:'id="abc" class="def"'},{name:"Delete", type:"Button", htmlAttrbs:'id="ijk" class="lmn"'}]},
		{"Sno":1,"firstname":"Michelle","lastname":"Fisher","jobtitle":"HRD/Training and Development Administrator","county":"Summerbush","countyStyle":"color:red","city":"East Pepperell","email":"michelle.fisher@kmail.com","mobile":815231416,selectable:false,actions:[{name:"Edit", type:"Button", htmlAttrbs:'id="abc" class="def"'},{name:"Delete", type:"Button", htmlAttrbs:'id="ijk" class="lmn"'}]},
		{"Sno":2,"firstname":"Phil","lastname":"Poole","jobtitle":"Training Coordinator","county":"Edgecliff","city":"Ashkum","email":"phil.poole@kmail.com","mobile":833966721},
		{"Sno":3,"firstname":"Joshua","lastname":"Gibson","jobtitle":"Sales Consultant","county":"Westercrest","city":"Lanesville","email":"joshua.gibson@kmail.com","mobile":812850587},
		{"Sno":4,"firstname":"Sally","lastname":"Young","jobtitle":"High-Pressure Engineer","county":"Esterlyn","city":"Ponder","email":"sally.young@kmail.com","mobile":920749308},
		{"Sno":5,"firstname":"Lily","lastname":"Rutherford","jobtitle":"Human Resources Business Partner","county":"Fieldpond","city":"Woolstock","email":"lily.rutherford@kmail.com","mobile":823587095},
		{"Sno":6,"firstname":"Rose","lastname":"Hudson","jobtitle":"HRD/Training and Development Supervisor","county":"Fallmount","city":"Belle Haven","email":"rose.hudson@kmail.com","mobile":808462902},
		{"Sno":7,"firstname":"Joseph","lastname":"King","jobtitle":"SCADA Engineer","county":"Glasshurst","city":"Ankeny","email":"joseph.king@kmail.com","mobile":916040494},
		{"Sno":8,"firstname":"John","lastname":"MacDonald","jobtitle":"Recruiting and Sourcing Coordinator","county":"Corhall","city":"Winnett","email":"john.macdonald@kmail.com","mobile":780235714},
		{"Sno":9,"firstname":"Alan","lastname":"Turner","jobtitle":"Regional Sales Manager","county":"Ormount","city":"Duxbury","email":"alan.turner@kmail.com","mobile":872910895},
		{"Sno":10,"firstname":"Amelia","lastname":"Johnston","jobtitle":"Application Developer","county":"Westermont","city":"Sangrey","email":"amelia.johnston@kmail.com","mobile":829581422},
		{"Sno":11,"firstname":"Jan","lastname":"Grant","jobtitle":"Chief Information Officer (CIO) ","county":"Rockpond","city":"Gibbsville","email":"jan.grant@kmail.com","mobile":895575255},
		{"Sno":12,"firstname":"Jasmine","lastname":"Underwood","jobtitle":"Computer Hardware Engineer","county":"Dorton","city":"Lowes Island","email":"jasmine.underwood@kmail.com","mobile":794385551},
		{"Sno":13,"firstname":"Stephen","lastname":"Mackenzie","jobtitle":"Environmental Health Safety Engineer","county":"Morpond","city":"Lakes","email":"stephen.mackenzie@kmail.com","mobile":899192679},
		{"Sno":14,"firstname":"Ava","lastname":"Lee","jobtitle":"Research and Development Engineer","county":"Whiteham","city":"Council Hill","email":"ava.lee@kmail.com","mobile":779513372},
		{"Sno":15,"firstname":"Sally","lastname":"Paterson","jobtitle":"Safety Engineer","county":"Magedell","city":"Chest Springs","email":"sally.paterson@kmail.com","mobile":856321421},
		{"Sno":16,"firstname":"Bernadette","lastname":"Pullman","jobtitle":"Welding Engineer","county":"Springston","city":"Winfred","email":"bernadette.pullman@kmail.com","mobile":825969745},
		{"Sno":17,"firstname":"David","lastname":"Sanderson","jobtitle":"Sales Representative - Territory Lead","county":"Eastedge","city":"Aledo","email":"david.sanderson@kmail.com","mobile":796550181},
		{"Sno":18,"firstname":"Pippa","lastname":"Knox","jobtitle":"Sales Representative","county":"Flowercliff","city":"Oak Forest","email":"pippa.knox@kmail.com","mobile":815941383},
		{"Sno":19,"firstname":"Joan","lastname":"Blake","jobtitle":"Technical Specialist","county":"Spellland","city":"Flora","email":"joan.blake@kmail.com","mobile":893240121},
		{"Sno":20,"firstname":"Wanda","lastname":"Lawrence","jobtitle":"Chief Engineer","county":"Pondhollow","city":"Orocovis","email":"wanda.lawrence@kmail.com","mobile":913452416},
		{"Sno":21,"firstname":"Amanda","lastname":"Poole","jobtitle":"Engineering Aide","county":"Bushedge","city":"Taylor","email":"amanda.poole@kmail.com","mobile":839194696},
		{"Sno":22,"firstname":"Yvonne","lastname":"Butler","jobtitle":"Director of Talent","county":"Eastlyn","city":"Mount Ivy","email":"yvonne.butler@kmail.com","mobile":849123411},
		{"Sno":23,"firstname":"Robert","lastname":"Bond","jobtitle":"Sales Representative","county":"Crystalbarrow","city":"Minor Hill","email":"robert.bond@kmail.com","mobile":861224219},
		{"Sno":24,"firstname":"Faith","lastname":"Welch","jobtitle":"Sales Assistant","county":"Goldford","city":"Piltzville","email":"faith.welch@kmail.com","mobile":815003871},
		{"Sno":25,"firstname":"Amelia","lastname":"Martin","jobtitle":"Petroleum Engineer","county":"Wildewynne","city":"Natoma","email":"amelia.martin@kmail.com","mobile":892014345},
		{"Sno":26,"firstname":"Natalie","lastname":"Anderson","jobtitle":"Coordinator, Administrative Services","county":"Nornesse","city":"Solon","email":"natalie.anderson@kmail.com","mobile":810925301},
		{"Sno":27,"firstname":"Harry","lastname":"Ferguson","jobtitle":"Safety Compliance and Recruitment Specialist","county":"Silverhaven","city":"Champion","email":"harry.ferguson@kmail.com","mobile":876319354},
		{"Sno":28,"firstname":"Joe","lastname":"Robertson","jobtitle":"Health and Safety Engineer","county":"Mistden","city":"Bear Valley","email":"joe.robertson@kmail.com","mobile":916937420},
		{"Sno":29,"firstname":"Carl","lastname":"Sutherland","jobtitle":"Administrative Manager","county":"Faydale","city":"Ben Avon Heights","email":"carl.sutherland@kmail.com","mobile":845707278},
		{"Sno":30,"firstname":"Caroline","lastname":"Marshall","jobtitle":"HRIS Manager","county":"Brightspell","city":"Smithsburg","email":"caroline.marshall@kmail.com","mobile":871330972},
		{"Sno":31,"firstname":"Samantha","lastname":"Ball","jobtitle":"Web Developer","county":"Wildecrystal","city":"La Paz Valley","email":"samantha.ball@kmail.com","mobile":786866074},
		{"Sno":32,"firstname":"Benjamin","lastname":"Allan","jobtitle":"Systems Designer","county":"Dragonbridge","city":"Ozark","email":"benjamin.allan@kmail.com","mobile":800653823},
		{"Sno":33,"firstname":"Simon","lastname":"Ross","jobtitle":"Validation Engineer","county":"Coldwall","city":"Morris","email":"simon.ross@kmail.com","mobile":861323833},
		{"Sno":34,"firstname":"Austin","lastname":"Fisher","jobtitle":"IT Support Manager","county":"Pinetown","city":"Parkman","email":"austin.fisher@kmail.com","mobile":841150614},
		{"Sno":35,"firstname":"Virginia","lastname":"Harris","jobtitle":"Network Architect","county":"Northpond","city":"Rickreall","email":"virginia.harris@kmail.com","mobile":902724977},
		{"Sno":36,"firstname":"Hannah","lastname":"Dowd","jobtitle":"Staking Engineer","county":"Aldden","city":"Ehrhardt","email":"hannah.dowd@kmail.com","mobile":784772978},
		{"Sno":37,"firstname":"Tim","lastname":"Forsyth","jobtitle":"Associate Director of Human Resources","county":"Linbeach","city":"Ulm","email":"tim.forsyth@kmail.com","mobile":825673187},
		{"Sno":38,"firstname":"Liam","lastname":"Metcalfe","jobtitle":"Coordinator, Administrative Services","county":"Mistston","city":"Fingal","email":"liam.metcalfe@kmail.com","mobile":872502313},
		{"Sno":39,"firstname":"Andrew","lastname":"Parsons","jobtitle":"District Human Resources Manager","county":"Esterhollow","city":"Claire City","email":"andrew.parsons@kmail.com","mobile":819262605},
		{"Sno":40,"firstname":"Jennifer","lastname":"Paterson","jobtitle":"Senior Systems Analyst","county":"Vertwind","city":"Bonfield","email":"jennifer.paterson@kmail.com","mobile":818771988},
		{"Sno":41,"firstname":"Jennifer","lastname":"Scott","jobtitle":"Electrical Engineer","county":"Greywald","city":"Noblesville","email":"jennifer.scott@kmail.com","mobile":840060339},
		{"Sno":42,"firstname":"Steven","lastname":"Nash","jobtitle":"Validation Engineer","county":"Mallowmill","city":"Fenton","email":"steven.nash@kmail.com","mobile":804699415},
		{"Sno":43,"firstname":"Maria","lastname":"Hill","jobtitle":"IT Support Manager","county":"Clearedge","city":"West Livingston","email":"maria.hill@kmail.com","mobile":915493169},
		{"Sno":44,"firstname":"Pippa","lastname":"Underwood","jobtitle":"Firmware Engineer","county":"Vertcastle","city":"Anaconda","email":"pippa.underwood@kmail.com","mobile":799546109},
		{"Sno":45,"firstname":"Adrian","lastname":"Lewis","jobtitle":"Talent Acquisition Manager","county":"Iceston","city":"Bryan","email":"adrian.lewis@kmail.com","mobile":787541719},
		{"Sno":46,"firstname":"Paul","lastname":"Gibson","jobtitle":"Product Manager","county":"Oldwitch","city":"Clayville","email":"paul.gibson@kmail.com","mobile":841281225},
		{"Sno":47,"firstname":"Anne","lastname":"Gibson","jobtitle":"Human Resources Consultant","county":"Wintervale","city":"Hampton Manor","email":"anne.gibson@kmail.com","mobile":852961070},
		{"Sno":48,"firstname":"Una","lastname":"Hart","jobtitle":"Human Resources Specialist","county":"Ormont","city":"Our Town","email":"una.hart@kmail.com","mobile":917068775},
		{"Sno":49,"firstname":"Dominic","lastname":"Walsh","jobtitle":"Human Resources Officer","county":"Westtown","city":"Export","email":"dominic.walsh@kmail.com","mobile":830379233},
		{"Sno":50,"firstname":"John","lastname":"Mathis","jobtitle":"Plant Engineer","county":"Shadeshore","city":"Ironwood","email":"john.mathis@kmail.com","mobile":897230993},
		{"Sno":51,"firstname":"Amanda","lastname":"Grant","jobtitle":"HRD/Training and Development Administrator","county":"Lochville","city":"Radcliffe","email":"amanda.grant@kmail.com","mobile":823982092},
		{"Sno":52,"firstname":"Ryan","lastname":"Gray","jobtitle":"Senior Employee Benefits Consultant","county":"Lightbush","city":"McKees Rocks","email":"ryan.gray@kmail.com","mobile":811191039},
		{"Sno":53,"firstname":"Kevin","lastname":"Wright","jobtitle":"Social Media Marketing Coordinator ","county":"Buttercrystal","city":"Golden Hills","email":"kevin.wright@kmail.com","mobile":820211191},
		{"Sno":54,"firstname":"Carol","lastname":"Fisher","jobtitle":"Information Technology Coordinator","county":"Blueelf","city":"Leetonia","email":"carol.fisher@kmail.com","mobile":814103397},
		{"Sno":55,"firstname":"Jasmine","lastname":"Short","jobtitle":"Network Systems Administrator","county":"Lorcastle","city":"Herscher","email":"jasmine.short@kmail.com","mobile":858285293},
		{"Sno":56,"firstname":"Tracey","lastname":"Hardacre","jobtitle":"Boiler Engineer","county":"Bluebarrow","city":"Scandia","email":"tracey.hardacre@kmail.com","mobile":806346780},
		{"Sno":57,"firstname":"Anthony","lastname":"Burgess","jobtitle":"Controls Engineer","county":"Rayborough","city":"Fort Valley","email":"anthony.burgess@kmail.com","mobile":781626887},
		{"Sno":58,"firstname":"Zoe","lastname":"Ross","jobtitle":"Human Resources Officer","county":"Landmoor","city":"Leonardville","email":"zoe.ross@kmail.com","mobile":876605346},
		{"Sno":59,"firstname":"Jan","lastname":"McLean","jobtitle":"Senior Programmer","county":"Redness","city":"Ralston","email":"jan.mclean@kmail.com","mobile":826601371},
		{"Sno":60,"firstname":"Liam","lastname":"Mathis","jobtitle":"Entry Level Engineer","county":"Whitecoast","city":"Lake Ketchum","email":"liam.mathis@kmail.com","mobile":906762437},
		{"Sno":61,"firstname":"Sarah","lastname":"Martin","jobtitle":"Project Controls Engineer","county":"Dorden","city":"Ecorse","email":"sarah.martin@kmail.com","mobile":917020669},
		{"Sno":62,"firstname":"Zoe","lastname":"Gray","jobtitle":"Administrative Manager","county":"Ironwinter","city":"Wilbur","email":"zoe.gray@kmail.com","mobile":888902773},
		{"Sno":63,"firstname":"Wendy","lastname":"McLean","jobtitle":"Contract Recruiter","county":"Lightmerrow","city":"Abram","email":"wendy.mclean@kmail.com","mobile":828627449},
		{"Sno":64,"firstname":"Ella","lastname":"Mackay","jobtitle":"Human Resources Associate","county":"Elftown","city":"Dundarrach","email":"ella.mackay@kmail.com","mobile":846176951},
		{"Sno":65,"firstname":"Hannah","lastname":"Greene","jobtitle":"Union Relations","county":"Clearwilde","city":"Richlandtown","email":"hannah.greene@kmail.com","mobile":783926425},
		{"Sno":66,"firstname":"Stewart","lastname":"Anderson","jobtitle":"Sales Trainee","county":"Highsummer","city":"Palermo","email":"stewart.anderson@kmail.com","mobile":795786233},
		{"Sno":67,"firstname":"Bella","lastname":"Martin","jobtitle":"Market Research Assistant","county":"Elfville","city":"Ash Fork","email":"bella.martin@kmail.com","mobile":798233968},
		{"Sno":68,"firstname":"Donna","lastname":"Blake","jobtitle":"Sales Associate","county":"Rosedeer","city":"Inkerman","email":"donna.blake@kmail.com","mobile":796928890},
		{"Sno":69,"firstname":"Joe","lastname":"Quinn","jobtitle":"Plant Engineer","county":"Iceview","city":"Ranshaw","email":"joe.quinn@kmail.com","mobile":788310995},
		{"Sno":70,"firstname":"Jan","lastname":"Stewart","jobtitle":"HRD/Training and Development Vice President","county":"Stoneley","city":"Tatitlek","email":"jan.stewart@kmail.com","mobile":899228274},
		{"Sno":71,"firstname":"Jan","lastname":"Hunter","jobtitle":"Data Center Support Specialist","county":"Blackspring","city":"Walsh","email":"jan.hunter@kmail.com","mobile":793239951},
		{"Sno":72,"firstname":"Trevor","lastname":"Roberts","jobtitle":"Stationary Engineer","county":"Pinemoor","city":"Greers Ferry","email":"trevor.roberts@kmail.com","mobile":817273110},
		{"Sno":73,"firstname":"Zoe","lastname":"Bower","jobtitle":"Category Manager, HR","county":"Osthill","city":"Madisonburg","email":"zoe.bower@kmail.com","mobile":842834684},
		{"Sno":74,"firstname":"Julian","lastname":"Hamilton","jobtitle":"Programmer","county":"Wildecourt","city":"Terrell Hills","email":"julian.hamilton@kmail.com","mobile":800156532},
		{"Sno":75,"firstname":"Diane","lastname":"Avery","jobtitle":"Environmental Engineer","county":"Swynshore","city":"Stannards","email":"diane.avery@kmail.com","mobile":820928728},
		{"Sno":76,"firstname":"Max","lastname":"Cameron","jobtitle":"Piping Stress Engineer","county":"Newhaven","city":"Hublersburg","email":"max.cameron@kmail.com","mobile":868184723},
		{"Sno":77,"firstname":"Dan","lastname":"MacDonald","jobtitle":"Organizational Development Specialist","county":"Strongcrystal","city":"Balfour","email":"dan.macdonald@kmail.com","mobile":817483862},
		{"Sno":78,"firstname":"Dorothy","lastname":"Mackenzie","jobtitle":"Creative Director","county":"Wyvernbridge","city":"Las Haciendas","email":"dorothy.mackenzie@kmail.com","mobile":879024515},
		{"Sno":79,"firstname":"Victor","lastname":"Johnston","jobtitle":"Public Relations Manager","county":"Easthall","city":"La Porte","email":"victor.johnston@kmail.com","mobile":815016959},
		{"Sno":80,"firstname":"Carl","lastname":"Marshall","jobtitle":"Public Relations Representative","county":"Shadowbarrow","city":"Friendsville","email":"carl.marshall@kmail.com","mobile":893368053},
		{"Sno":81,"firstname":"Jake","lastname":"Butler","jobtitle":"Desktop Support Manager","county":"Shadowwell","city":"Essex Fells","email":"jake.butler@kmail.com","mobile":883540279},
		{"Sno":82,"firstname":"Kylie","lastname":"Murray","jobtitle":"Human Resources Assistant","county":"Glasscliff","city":"Chenoweth","email":"kylie.murray@kmail.com","mobile":892645364},
		{"Sno":83,"firstname":"Theresa","lastname":"Simpson","jobtitle":"Organizational Development Specialist","county":"Deepcoast","city":"Parkway Village","email":"theresa.simpson@kmail.com","mobile":834064911},
		{"Sno":84,"firstname":"Tracey","lastname":"Chapman","jobtitle":"Promotions Director","county":"Beechhedge","city":"Cidra","email":"tracey.chapman@kmail.com","mobile":908056227},
		{"Sno":85,"firstname":"Heather","lastname":"Metcalfe","jobtitle":"Boiler Engineer","county":"Aldmist","city":"Amarillo","email":"heather.metcalfe@kmail.com","mobile":819083493},
		{"Sno":86,"firstname":"Heather","lastname":"King","jobtitle":"Engineering Clerk","county":"Lorpond","city":"Nikolai","email":"heather.king@kmail.com","mobile":780911752},
		{"Sno":87,"firstname":"Megan","lastname":"Lawrence","jobtitle":"Mining Safety Engineer","county":"Whitebeach","city":"Peavine","email":"megan.lawrence@kmail.com","mobile":801708415},
		{"Sno":88,"firstname":"Carl","lastname":"Davidson","jobtitle":"Technical Specialist","county":"Janham","city":"North Adams","email":"carl.davidson@kmail.com","mobile":783819600},
		{"Sno":89,"firstname":"Lauren","lastname":"Nash","jobtitle":"HRD/Training and Development Specialist","county":"Ironash","city":"Pierpont","email":"lauren.nash@kmail.com","mobile":860736874},
		{"Sno":90,"firstname":"Harry","lastname":"Gill","jobtitle":"Senior Security Specialist","county":"Lightshade","city":"Timber Hills","email":"harry.gill@kmail.com","mobile":785893152},
		{"Sno":91,"firstname":"Sebastian","lastname":"Coleman","jobtitle":"Protection Engineer","county":"Summercastle","city":"Mequon","email":"sebastian.coleman@kmail.com","mobile":816749866},
		{"Sno":92,"firstname":"Peter","lastname":"Hughes","jobtitle":"Specialty Sales Representative","county":"Raymount","city":"El Mesquite","email":"peter.hughes@kmail.com","mobile":874994992},
		{"Sno":93,"firstname":"Christian","lastname":"Ball","jobtitle":"Marine Engineer","county":"Southlake","city":"Norfork","email":"christian.ball@kmail.com","mobile":786111275},
		{"Sno":94,"firstname":"Connor","lastname":"Allan","jobtitle":"Stationary Engineer","county":"Milldell","city":"Swartz","email":"connor.allan@kmail.com","mobile":788977941},
		{"Sno":95,"firstname":"Stewart","lastname":"McDonald","jobtitle":"E-Learning Manager","county":"Oakpond","city":"Austwell","email":"stewart.mcdonald@kmail.com","mobile":844031221},
		{"Sno":96,"firstname":"Nathan","lastname":"Payne","jobtitle":"Validation Engineer","county":"Goldview","city":"West Waynesburg","email":"nathan.payne@kmail.com","mobile":881414831},
		{"Sno":97,"firstname":"Una","lastname":"Turner","jobtitle":"Union Relations","county":"Oakdale","city":"Mercer Island","email":"una.turner@kmail.com","mobile":878183570},
		{"Sno":98,"firstname":"Sonia","lastname":"Mackenzie","jobtitle":"IT Support Manager","county":"Stronggriffin","city":"Hartrandt","email":"sonia.mackenzie@kmail.com","mobile":858027740},
		{"Sno":99,"firstname":"Audrey","lastname":"Ferguson","jobtitle":"Benefits and Work Comp Manager","county":"Goldedge","city":"La Loma de Falcon","email":"audrey.ferguson@kmail.com","mobile":875454442},
		{"Sno":100,"firstname":"Diane","lastname":"Harris","jobtitle":"Route Sales Representative","county":"Fairbush","city":"Forrest City","email":"diane.harris@kmail.com","mobile":875950056},
		{"Sno":101,"firstname":"Ian","lastname":"Skinner","jobtitle":"Market Research Assistant","county":"Northbay","city":"Northbrook","email":"ian.skinner@kmail.com","mobile":818221711},
		{"Sno":102,"firstname":"Frank","lastname":"Dowd","jobtitle":"Social Media Marketing Manager","county":"Dracfield","city":"Harlowton","email":"frank.dowd@kmail.com","mobile":832326355},
		{"Sno":103,"firstname":"Anthony","lastname":"Johnston","jobtitle":"HRD/Training and Development Specialist","county":"Southsilver","city":"Cement City","email":"anthony.johnston@kmail.com","mobile":894831832},
		{"Sno":104,"firstname":"Fiona","lastname":"Wilson","jobtitle":"Social Media Marketing Coordinator ","county":"Goldrose","city":"Malibu","email":"fiona.wilson@kmail.com","mobile":863183974},
		{"Sno":105,"firstname":"Fiona","lastname":"Slater","jobtitle":"eCommerce Recruiter - HR Coordinator","county":"Wooddale","city":"Carol Stream","email":"fiona.slater@kmail.com","mobile":896211649},
		{"Sno":106,"firstname":"Keith","lastname":"Welch","jobtitle":"Organizational Development Manager","county":"Starryville","city":"Westover Hills","email":"keith.welch@kmail.com","mobile":880798025},
		{"Sno":107,"firstname":"Diane","lastname":"Paige","jobtitle":"Sales Representative - Territory Lead","county":"Ashcliff","city":"Glen Ullin","email":"diane.paige@kmail.com","mobile":820000750},
		{"Sno":108,"firstname":"Alan","lastname":"Gibson","jobtitle":"Biological Engineer","county":"Highhaven","city":"Star Valley Ranch","email":"alan.gibson@kmail.com","mobile":920370635},
		{"Sno":109,"firstname":"Sally","lastname":"Clark","jobtitle":"E-Learning Specialist","county":"Foxhaven","city":"Greenwood Lake","email":"sally.clark@kmail.com","mobile":892360269},
		{"Sno":110,"firstname":"Rose","lastname":"Coleman","jobtitle":"Creative Assistant","county":"Ironshore","city":"Pink","email":"rose.coleman@kmail.com","mobile":777134984},
		{"Sno":111,"firstname":"Sebastian","lastname":"Wilkins","jobtitle":"Lead Engineer","county":"Rosemist","city":"Abernathy","email":"sebastian.wilkins@kmail.com","mobile":832732901},
		{"Sno":112,"firstname":"Dorothy","lastname":"MacLeod","jobtitle":"Production Engineer","county":"Winternesse","city":"Mountainair","email":"dorothy.macleod@kmail.com","mobile":864781406},
		{"Sno":113,"firstname":"Julia","lastname":"Johnston","jobtitle":"Job Posting Specialist","county":"Shoreburn","city":"Maplesville","email":"julia.johnston@kmail.com","mobile":853918337},
		{"Sno":114,"firstname":"Julia","lastname":"Carr","jobtitle":"Staffing Consultant","county":"Irondeer","city":"Shartlesville","email":"julia.carr@kmail.com","mobile":839960277},
		{"Sno":115,"firstname":"Warren","lastname":"Bailey","jobtitle":"Inside Salesperson","county":"Wyvernhaven","city":"Evanston","email":"warren.bailey@kmail.com","mobile":796775226},
		{"Sno":116,"firstname":"Adrian","lastname":"Powell","jobtitle":"Substation Engineer","county":"Easthedge","city":"Sylvester","email":"adrian.powell@kmail.com","mobile":833609405},
		{"Sno":117,"firstname":"Owen","lastname":"Bond","jobtitle":"Payroll Processing Specialist","county":"Fairfall","city":"Goleta","email":"owen.bond@kmail.com","mobile":902246787},
		{"Sno":118,"firstname":"Peter","lastname":"Parr","jobtitle":"Website Content Administrator","county":"Newfort","city":"Bingham Farms","email":"peter.parr@kmail.com","mobile":853081850},
		{"Sno":119,"firstname":"Simon","lastname":"Slater","jobtitle":"Internet Marketing Director","county":"Wellbourne","city":"White Swan","email":"simon.slater@kmail.com","mobile":867962052},
		{"Sno":120,"firstname":"Joseph","lastname":"Russell","jobtitle":"Senior System Designer","county":"Snowwyvern","city":"Jakes Corner","email":"joseph.russell@kmail.com","mobile":795732797},
		{"Sno":121,"firstname":"Connor","lastname":"Chapman","jobtitle":"Employee Benefits Law Specialist","county":"Southcastle","city":"Minersville","email":"connor.chapman@kmail.com","mobile":843791787},
		{"Sno":122,"firstname":"Jake","lastname":"Walsh","jobtitle":"HRD/Training and Development Vice President","county":"Crystalbell","city":"Whiteville","email":"jake.walsh@kmail.com","mobile":792626534},
		{"Sno":123,"firstname":"Melanie","lastname":"Johnston","jobtitle":"Manager of Engineering","county":"Dorbarrow","city":"Carrizo","email":"melanie.johnston@kmail.com","mobile":885806223},
		{"Sno":124,"firstname":"Robert","lastname":"Allan","jobtitle":"Systems Analyst","county":"Silvercastle","city":"South San Francisco","email":"robert.allan@kmail.com","mobile":867342193},
		{"Sno":125,"firstname":"John","lastname":"Allan","jobtitle":"Customer Support Administrator","county":"Redmarsh","city":"North Port","email":"john.allan@kmail.com","mobile":866212075},
		{"Sno":126,"firstname":"Alison","lastname":"Murray","jobtitle":"Mechanical Engineer","county":"Winterley","city":"Plaquemine","email":"alison.murray@kmail.com","mobile":797143359},
		{"Sno":127,"firstname":"Audrey","lastname":"Taylor","jobtitle":"E-Learning Analyst","county":"Wheatcastle","city":"American Falls","email":"audrey.taylor@kmail.com","mobile":880662745},
		{"Sno":128,"firstname":"Lillian","lastname":"Russell","jobtitle":"HR Administrative Assistant","county":"Courtnesse","city":"Point Clear","email":"lillian.russell@kmail.com","mobile":918179584},
		{"Sno":129,"firstname":"Charles","lastname":"Parr","jobtitle":"Account Representative","county":"Redcoast","city":"Elfrida","email":"charles.parr@kmail.com","mobile":783078984},
		{"Sno":130,"firstname":"John","lastname":"Cornish","jobtitle":"Staking Engineer","county":"Rayton","city":"St. Ignatius","email":"john.cornish@kmail.com","mobile":844522027},
		{"Sno":131,"firstname":"Samantha","lastname":"Ross","jobtitle":"Human Resources Associate","county":"Wildemeadow","city":"Gaylord","email":"samantha.ross@kmail.com","mobile":869615764},
		{"Sno":132,"firstname":"Christopher","lastname":"Parr","jobtitle":"Training and Technical Assistance Coordinator","county":"Millland","city":"Cooperton","email":"christopher.parr@kmail.com","mobile":895788861},
		{"Sno":133,"firstname":"Thomas","lastname":"Chapman","jobtitle":"Firmware Engineer","county":"Glasscrystal","city":"Valley Bend","email":"thomas.chapman@kmail.com","mobile":884621185},
		{"Sno":134,"firstname":"Jacob","lastname":"McGrath","jobtitle":"Human Resources Consultant","county":"Lochcliff","city":"Tennessee","email":"jacob.mcgrath@kmail.com","mobile":897900722},
		{"Sno":135,"firstname":"John","lastname":"Morrison","jobtitle":"Vice President of People","county":"Summerhall","city":"Big Bear City","email":"john.morrison@kmail.com","mobile":882451582},
		{"Sno":136,"firstname":"Wendy","lastname":"Manning","jobtitle":"Electro-Mechanical Engineer","county":"Lightmallow","city":"Iron Junction","email":"wendy.manning@kmail.com","mobile":901993905},
		{"Sno":137,"firstname":"Dorothy","lastname":"Clarkson","jobtitle":"Talent Acquisition Manager","county":"Goldshore","city":"Delbarton","email":"dorothy.clarkson@kmail.com","mobile":819912623},
		{"Sno":138,"firstname":"Leah","lastname":"Avery","jobtitle":"Publicity Manager","county":"Dracnesse","city":"Makanda","email":"leah.avery@kmail.com","mobile":806404679},
		{"Sno":139,"firstname":"Leonard","lastname":"Mitchell","jobtitle":"Technical Support Engineer","county":"Fairsea","city":"Longfellow","email":"leonard.mitchell@kmail.com","mobile":902760495},
		{"Sno":140,"firstname":"Nicola","lastname":"Ball","jobtitle":"Telecommunications Engineer","county":"Fairland","city":"Piqua","email":"nicola.ball@kmail.com","mobile":797699545},
		{"Sno":141,"firstname":"Steven","lastname":"Ball","jobtitle":"Human Resources Advocate","county":"Redwinter","city":"Zena","email":"steven.ball@kmail.com","mobile":830799442},
		{"Sno":142,"firstname":"Grace","lastname":"Dyer","jobtitle":"Assistant Product Manager","county":"Mapleedge","city":"Rock Mills","email":"grace.dyer@kmail.com","mobile":900681646},
		{"Sno":143,"firstname":"David","lastname":"Roberts","jobtitle":"Brand Strategist","county":"Witchhill","city":"Lewisport","email":"david.roberts@kmail.com","mobile":891029298},
		{"Sno":144,"firstname":"Keith","lastname":"Marshall","jobtitle":"Marketing Manager","county":"Byice","city":"Singac","email":"keith.marshall@kmail.com","mobile":811013364},
		{"Sno":145,"firstname":"Carol","lastname":"Vaughan","jobtitle":"Senior System Administrator","county":"Swynhill","city":"Iron Belt","email":"carol.vaughan@kmail.com","mobile":873932777},
		{"Sno":146,"firstname":"Warren","lastname":"Metcalfe","jobtitle":"Organizational Development Administrator","county":"Brightton","city":"Calvin","email":"warren.metcalfe@kmail.com","mobile":797170565},
		{"Sno":147,"firstname":"Dylan","lastname":"Forsyth","jobtitle":"Frontend Engineer","county":"Marshdell","city":"Naples","email":"dylan.forsyth@kmail.com","mobile":781508833},
		{"Sno":148,"firstname":"Alan","lastname":"Rees","jobtitle":"Sales Assistant","county":"Wayedge","city":"Plentywood","email":"alan.rees@kmail.com","mobile":823151436},
		{"Sno":149,"firstname":"Rose","lastname":"Brown","jobtitle":"Art Director","county":"Morlyn","city":"Leonardville","email":"rose.brown@kmail.com","mobile":834085820},
		{"Sno":150,"firstname":"Fiona","lastname":"Underwood","jobtitle":"E-Learning Specialist","county":"Barrowbeach","city":"Lufkin","email":"fiona.underwood@kmail.com","mobile":846358129},
		{"Sno":151,"firstname":"Lily","lastname":"Scott","jobtitle":"Lead Engineer","county":"Greyham","city":"Maple Falls","email":"lily.scott@kmail.com","mobile":881222086},
		{"Sno":152,"firstname":"Dan","lastname":"Hemmings","jobtitle":"Vice President of Human Resources","county":"Bluefalcon","city":"Fort Deposit","email":"dan.hemmings@kmail.com","mobile":850554119},
		{"Sno":153,"firstname":"Samantha","lastname":"Russell","jobtitle":"Staff Engineer","county":"Ironbush","city":"Elm City","email":"samantha.russell@kmail.com","mobile":826805735},
		{"Sno":154,"firstname":"Piers","lastname":"Glover","jobtitle":"B2B Corporate Sales ","county":"Northcastle","city":"Garden Prairie","email":"piers.glover@kmail.com","mobile":803112565},
		{"Sno":155,"firstname":"Sally","lastname":"Nash","jobtitle":"Help Desk Specialist","county":"Linview","city":"Staunton","email":"sally.nash@kmail.com","mobile":905481795},
		{"Sno":156,"firstname":"Kevin","lastname":"Carr","jobtitle":"Compliance Engineer","county":"Edgebeach","city":"Dripping Springs","email":"kevin.carr@kmail.com","mobile":867059509},
		{"Sno":157,"firstname":"Tim","lastname":"Young","jobtitle":"Employee Relations Specialist","county":"Violetfield","city":"Ulen","email":"tim.young@kmail.com","mobile":861752401},
		{"Sno":158,"firstname":"James","lastname":"Buckland","jobtitle":"Programmer","county":"Aldborough","city":"Maunabo","email":"james.buckland@kmail.com","mobile":883076775},
		{"Sno":159,"firstname":"Andrea","lastname":"Hudson","jobtitle":"Senior Support Specialist","county":"Woodmill","city":"East Renton Highlands","email":"andrea.hudson@kmail.com","mobile":917311238},
		{"Sno":160,"firstname":"Fiona","lastname":"Alsop","jobtitle":"Chief People Officer","county":"Deermarsh","city":"Carrizo Springs","email":"fiona.alsop@kmail.com","mobile":896800430},
		{"Sno":161,"firstname":"Vanessa","lastname":"Peake","jobtitle":"Employee Relations Manager","county":"Valden","city":"South Wilmington","email":"vanessa.peake@kmail.com","mobile":898928346},
		{"Sno":162,"firstname":"Jan","lastname":"Mackay","jobtitle":"Director of Digital Marketing","county":"Stonebank","city":"Klamath","email":"jan.mackay@kmail.com","mobile":791728751},
		{"Sno":163,"firstname":"Colin","lastname":"Mackenzie","jobtitle":"Market Research Assistant","county":"Corpond","city":"Dupree","email":"colin.mackenzie@kmail.com","mobile":893286074},
		{"Sno":164,"firstname":"Warren","lastname":"Short","jobtitle":"Turbine Engineer","county":"Stonemount","city":"Tilton Northfield","email":"warren.short@kmail.com","mobile":800792321},
		{"Sno":165,"firstname":"Edward","lastname":"Gibson","jobtitle":"Automotive Engineer","county":"Foxmarsh","city":"Fronton","email":"edward.gibson@kmail.com","mobile":798469300},
		{"Sno":166,"firstname":"Richard","lastname":"Vaughan","jobtitle":"Plant Human Resources Manager","county":"Springgate","city":"Tony","email":"richard.vaughan@kmail.com","mobile":896975185},
		{"Sno":167,"firstname":"Ava","lastname":"Scott","jobtitle":"Social Media Recruiter","county":"Freyburn","city":"Morrice","email":"ava.scott@kmail.com","mobile":831000274},
		{"Sno":168,"firstname":"Cameron","lastname":"Newman","jobtitle":"Employee Relations Manager","county":"Norhill","city":"West Elizabeth","email":"cameron.newman@kmail.com","mobile":912624260},
		{"Sno":169,"firstname":"Jasmine","lastname":"Churchill","jobtitle":"Metallurgical Engineer","county":"Springley","city":"Mira Monte","email":"jasmine.churchill@kmail.com","mobile":853313661},
		{"Sno":170,"firstname":"Bella","lastname":"Abraham","jobtitle":"Senior Support Specialist","county":"Eastdale","city":"Davis Junction","email":"bella.abraham@kmail.com","mobile":909817175},
		{"Sno":171,"firstname":"Dorothy","lastname":"Coleman","jobtitle":".NET Developer","county":"Bluehollow","city":"Hedwig Village","email":"dorothy.coleman@kmail.com","mobile":868501047},
		{"Sno":172,"firstname":"Katherine","lastname":"Duncan","jobtitle":"E-Learning Director","county":"Starrylake","city":"Mountain Mesa","email":"katherine.duncan@kmail.com","mobile":816601182},
		{"Sno":173,"firstname":"Peter","lastname":"Robertson","jobtitle":"Senior Network System Administrator","county":"Whitebank","city":"McCall","email":"peter.robertson@kmail.com","mobile":895048787},
		{"Sno":174,"firstname":"Brian","lastname":"Newman","jobtitle":"Manager IS Risk and Compliance","county":"Coldford","city":"Waterville","email":"brian.newman@kmail.com","mobile":787778757},
		{"Sno":175,"firstname":"Lucas","lastname":"Paige","jobtitle":"Webmaster","county":"Wyvernwald","city":"Bergman","email":"lucas.paige@kmail.com","mobile":865273348},
		{"Sno":176,"firstname":"Hannah","lastname":"Robertson","jobtitle":"Specialty Sales Representative","county":"Silverborough","city":"Alvin","email":"hannah.robertson@kmail.com","mobile":833048652},
		{"Sno":177,"firstname":"Bernadette","lastname":"Rampling","jobtitle":"Account Executive","county":"Freyvale","city":"Holiday Pocono","email":"bernadette.rampling@kmail.com","mobile":848866414},
		{"Sno":178,"firstname":"Kimberly","lastname":"Jackson","jobtitle":"IT Support Specialist","county":"Brightcoast","city":"La Mesa","email":"kimberly.jackson@kmail.com","mobile":817243711},
		{"Sno":179,"firstname":"Rebecca","lastname":"Simpson","jobtitle":"Civil Engineer","county":"Fairpine","city":"Allen","email":"rebecca.simpson@kmail.com","mobile":790891161},
		{"Sno":180,"firstname":"Phil","lastname":"Welch","jobtitle":"Process Control Engineer","county":"Crystalmere","city":"Wakita","email":"phil.welch@kmail.com","mobile":803359407},
		{"Sno":181,"firstname":"Phil","lastname":"Dyer","jobtitle":"eCommerce Recruiter - HR Coordinator","county":"Shadecliff","city":"Manalapan","email":"phil.dyer@kmail.com","mobile":819499076},
		{"Sno":182,"firstname":"Elizabeth","lastname":"Butler","jobtitle":"Marketing Associate","county":"Fallborough","city":"South Mansfield","email":"elizabeth.butler@kmail.com","mobile":895198949},
		{"Sno":183,"firstname":"Dominic","lastname":"Dowd","jobtitle":"Data Center Support Specialist","county":"Newiron","city":"Helena West Side","email":"dominic.dowd@kmail.com","mobile":784525846},
		{"Sno":184,"firstname":"Penelope","lastname":"Bell","jobtitle":"RF Engineer","county":"Hedgemill","city":"Rackerby","email":"penelope.bell@kmail.com","mobile":885513667},
		{"Sno":185,"firstname":"Alexandra","lastname":"North","jobtitle":"Sales Associate","county":"Woodford","city":"Columbus","email":"alexandra.north@kmail.com","mobile":891273206},
		{"Sno":186,"firstname":"William","lastname":"Rampling","jobtitle":"Systems Engineer","county":"Waywyn","city":"Protection","email":"william.rampling@kmail.com","mobile":810268215},
		{"Sno":187,"firstname":"Dan","lastname":"Churchill","jobtitle":"Human Resources Technician","county":"Lindale","city":"Lampeter","email":"dan.churchill@kmail.com","mobile":912231471},
		{"Sno":188,"firstname":"Stewart","lastname":"MacDonald","jobtitle":"Route Sales Representative","county":"Crystalbay","city":"Woodstown","email":"stewart.macdonald@kmail.com","mobile":845994869},
		{"Sno":189,"firstname":"Peter","lastname":"Morrison","jobtitle":"Promotions Director","county":"Dorholt","city":"Schuyler","email":"peter.morrison@kmail.com","mobile":917080877},
		{"Sno":190,"firstname":"Lily","lastname":"Kelly","jobtitle":"Telecommunications Specialist","county":"Coldfort","city":"Emelle","email":"lily.kelly@kmail.com","mobile":910405520},
		{"Sno":191,"firstname":"Colin","lastname":"Taylor","jobtitle":"Product Design/Development Engineer","county":"Falconshore","city":"Sinai","email":"colin.taylor@kmail.com","mobile":893419236},
		{"Sno":192,"firstname":"Frank","lastname":"Mills","jobtitle":"Programmer Analyst","county":"Marbleview","city":"Erick","email":"frank.mills@kmail.com","mobile":902736418},
		{"Sno":193,"firstname":"Sarah","lastname":"Blake","jobtitle":"Senior System Designer","county":"Ortown","city":"Lake Arbor","email":"sarah.blake@kmail.com","mobile":888079028},
		{"Sno":194,"firstname":"Donna","lastname":"Walsh","jobtitle":"Customer Care Representative","county":"Linmeadow","city":"Downers Grove","email":"donna.walsh@kmail.com","mobile":860774808},
		{"Sno":195,"firstname":"Edward","lastname":"Reid","jobtitle":"Online Product Manager","county":"Wyvernlake","city":"Patton Village","email":"edward.reid@kmail.com","mobile":844364590},
		{"Sno":196,"firstname":"Heather","lastname":"Mackenzie","jobtitle":"Network Engineer","county":"Iceapple","city":"Verde Village","email":"heather.mackenzie@kmail.com","mobile":863863992},
		{"Sno":197,"firstname":"Nicola","lastname":"Ross","jobtitle":"Protection Engineer","county":"Shoremoor","city":"River Hills","email":"nicola.ross@kmail.com","mobile":845316256},
		{"Sno":198,"firstname":"Kylie","lastname":"Ferguson","jobtitle":"Vice President of Diversity","county":"Havenbush","city":"Tooele","email":"kylie.ferguson@kmail.com","mobile":882318177},
		{"Sno":199,"firstname":"Jessica","lastname":"Springer","jobtitle":"Regional Sales Manager","county":"Lakemarsh","city":"Maryhill","email":"jessica.springer@kmail.com","mobile":820539169},
		{"Sno":200,"firstname":"Tracey","lastname":"Cornish","jobtitle":"Lead Engineer","county":"Grassedge","city":"Leasburg","email":"tracey.cornish@kmail.com","mobile":826428113},
		{"Sno":201,"firstname":"Faith","lastname":"Hamilton","jobtitle":"Chief Happiness Officer","county":"Bymeadow","city":"Rentchler","email":"faith.hamilton@kmail.com","mobile":866877173}
	];

/////////////////////////////////////////////////////////////////// Instance 2 ///////////////////////////////////////////////////////////////////////////

	$scope.features2 = {"selectColumn":true, "search":true, "pageSize":true, "paginationText":true, "export":true, "actionColumn":true};

	$scope.pagination2 = {};

	$scope.pageSizeOptions2 = { pageSizeMenu:['5','10','15','25','50'], defaultSize:'5'};

	//$scope.toolbarOptions2 = {toolbarType:"link", linkSize:10};

	$scope.columns2 = [
		{title:"SNo",dataKey:"Sno",sortKey:"Sno",width:"6%"},
		{title:"First Name",dataKey:"firstname",sortKey:"firstname",width:"10%"},
		{title:"Last Name",dataKey:"lastname",sortKey:"lastname",width:"10%"},
		{title:"Designation",dataKey:"jobtitle",sortKey:"jobtitle",width:"17%"},
		{title:"County",dataKey:"county",sortKey:"county",width:"10%",searchable:false},
		{title:"City",dataKey:"city",sortKey:"city",width:"10%"},
		{title:"Email",dataKey:"email",sortKey:"email",width:"14%",style:"overflow-wrap: break-word;word-wrap: break-word; word-break: break-all;"},
		{title:"Mobile",dataKey:"mobile",sortKey:"mobile",width:"10%"}
	];

	$scope.actionHandlers2 = {"Edit":$scope.editEmployee,"Delete":$scope.deleteEmployee};

	$scope.actionColumnOptions2 = {
		title:"Actions",
		colWidth:"13%",
		htmlAttrbs:'id="act-col-id" class="act-col-class"',
		actions:[{name:"Edit", type:"Button", htmlAttrbs:'id="bt-edit" class="bt-edit-class"'},{name:"Delete", type:"Link", href:"test.html", htmlAttrbs:'id="lnk-del-id" class="lnk-del-class"'}]
	};

	var pdfExportColumns2 = [
		{title: "SNo", dataKey: "Sno"},
		{title: "First Name", dataKey: "firstname"},
		{title: "Last Name", dataKey: "lastname"},
		{title: "Department", dataKey: "jobtitle"},
		{title: "City", dataKey: "city"},
		{title: "Mobile", dataKey: "mobile"},
		{title: "Email", dataKey: "email"}
	];

	var excelExportColumns2 = [
		{title: "SNo", dataKey: "Sno"},
		{title: "First Name", dataKey: "firstname"},
		{title: "Last Name", dataKey: "lastname"},
		{title: "Job Title", dataKey: "jobtitle"},
		{title: "City", dataKey: "city"},
		{title: "Mobile", dataKey: "mobile"},
		{title: "Email", dataKey: "email"}
	];

	var pdfExportStyle2 ={
		styles: { fillColor: [100, 255, 255],overflow: 'linebreak'},
		columnStyles: {id: {fillColor: 255} },
		margin: {top: 60},
	};

	$scope.exportOptions2 = [
		{type:"pdf",records:"page",columns:pdfExportColumns2,fileName:"Employee-Roster-Report",buttonName:"PdfPage",style:pdfExportStyle,header:'Employee Report'},
		{type:"pdf",records:"all",columns:pdfExportColumns2,fileName:"Employee-Roster-Report",buttonName:"PdfAll",style:pdfExportStyle,header:'Employee Report'},
		{type:"pdf",records:"selected",columns:pdfExportColumns2,fileName:"Employee-Roster-Report",buttonName:"Pdf",style:pdfExportStyle,header:'Employee Report'},
		{type:"excel",records:"page",columns:excelExportColumns2,fileName:"EmployeeRoster",buttonName:"XLPage"},
		{type:"excel",records:"all",columns:excelExportColumns2,fileName:"EmployeeRoster",buttonName:"XLAll"},
		{type:"excel",records:"selected",columns:excelExportColumns2,fileName:"EmployeeRoster",buttonName:"XL"},
	];

	$scope.getSelectedRecords2 = function() {
		var list = $scope.pagination2.getSelectedRecords();
		console.log('Number of records selected by you: '+list.length+'. They are: \n');
		for (var i=0; i < list.length; i++ ) {
			console.log(JSON.stringify(list[i]));
		}
	}

	$scope.printCurrentPage2 = function() {
		var list = $scope.pagination2.getCurrentPageRecords();
		console.log('Records in current page: '+list.length+'. They are: \n');
		for (var i=0; i < list.length; i++ ) {
			console.log(JSON.stringify(list[i]));
		}
	}

	$scope.employees2 = [
		{"Sno":300,"firstname":"Una","lastname":"Davies","jobtitle":"Human Resources Coach","county":"Lightmist","city":"Buford","email":"una.davies@kmail.com","mobile":842703842},
		{"Sno":301,"firstname":"Gordon","lastname":"Sutherland","jobtitle":"Sales Assistant","county":"Strongdale","city":"Cardigan Village","email":"gordon.sutherland@kmail.com","mobile":878450258},
		{"Sno":302,"firstname":"Boris","lastname":"Coleman","jobtitle":"Packaging Engineer","county":"Wheattown","city":"Mungary","email":"boris.coleman@kmail.com","mobile":865657847},
		{"Sno":303,"firstname":"Lisa","lastname":"Vance","jobtitle":"Process Design Engineer","county":"Eastwall","city":"Buxton","email":"lisa.vance@kmail.com","mobile":812220418},
		{"Sno":304,"firstname":"Justin","lastname":"Oliver","jobtitle":"Manager of Career and Employee Relations","county":"Wheatville","city":"Haden","email":"justin.oliver@kmail.com","mobile":887430159},
		{"Sno":305,"firstname":"Jessica","lastname":"Mitchell","jobtitle":"Recruiter","county":"Jandale","city":"Laura","email":"jessica.mitchell@kmail.com","mobile":777626511},
		{"Sno":306,"firstname":"Mary","lastname":"Wilson","jobtitle":"Digital Marketing Manager","county":"Winterbeach","city":"Mandurang","email":"mary.wilson@kmail.com","mobile":793393103},
		{"Sno":307,"firstname":"Andrea","lastname":"Watson","jobtitle":"Senior Web Developer","county":"Waterhollow","city":"Hollands","email":"andrea.watson@kmail.com","mobile":788878136},
		{"Sno":308,"firstname":"Molly","lastname":"Manning","jobtitle":"Turbine Engineer","county":"Lakenesse","city":"Hollow Tree","email":"molly.manning@kmail.com","mobile":910391603},
		{"Sno":309,"firstname":"Liam","lastname":"Brown","jobtitle":"Electro-Mechanical Engineer","county":"Snowford","city":"Vimy","email":"liam.brown@kmail.com","mobile":915957273},
		{"Sno":310,"firstname":"Kimberly","lastname":"Alsop","jobtitle":"Packaging Engineer","county":"Swyncastle","city":"Yapeen","email":"kimberly.alsop@kmail.com","mobile":917032521},
		{"Sno":311,"firstname":"Leah","lastname":"Abraham","jobtitle":"HR Generalist - Specializing in HRIS, Reporting and, Compliance","county":"Whitecastle","city":"Pyap","email":"leah.abraham@kmail.com","mobile":896870967},
		{"Sno":312,"firstname":"Christopher","lastname":"Lawrence","jobtitle":"Attorney","county":"Snowmarsh","city":"Wondalga","email":"christopher.lawrence@kmail.com","mobile":833523048},
		{"Sno":313,"firstname":"Jacob","lastname":"Hughes","jobtitle":"Trainer","county":"Summeredge","city":"Alawa","email":"jacob.hughes@kmail.com","mobile":848617038},
		{"Sno":314,"firstname":"Richard","lastname":"James","jobtitle":"User Interface (UI) Engineer","county":"Snowhollow","city":"Duri","email":"richard.james@kmail.com","mobile":848849501},
		{"Sno":315,"firstname":"Theresa","lastname":"Slater","jobtitle":"Programmer Analyst","county":"Strongloch","city":"Rye Park","email":"theresa.slater@kmail.com","mobile":849770004},
		{"Sno":316,"firstname":"Blake","lastname":"Chapman","jobtitle":"Application Developer","county":"Marbleden","city":"Parrakie","email":"blake.chapman@kmail.com","mobile":811860019},
		{"Sno":317,"firstname":"Angela","lastname":"Glover","jobtitle":"Test Engineer","county":"Griffinlake","city":"Angellala","email":"angela.glover@kmail.com","mobile":867176782},
		{"Sno":318,"firstname":"Madeleine","lastname":"Fraser","jobtitle":"Automotive Sales Representative","county":"Winterlyn","city":"Kinchina","email":"madeleine.fraser@kmail.com","mobile":874033063},
		{"Sno":319,"firstname":"Deirdre","lastname":"Clark","jobtitle":"Application Support Analyst","county":"Wellgold","city":"Pawngilly","email":"deirdre.clark@kmail.com","mobile":870798325},
		{"Sno":320,"firstname":"Adrian","lastname":"Ogden","jobtitle":"Compliance Engineer","county":"Rocknesse","city":"Bendenine","email":"adrian.ogden@kmail.com","mobile":812965549},
		{"Sno":321,"firstname":"Leonard","lastname":"Howard","jobtitle":"Enterprise Resources Planning Representative","county":"Freytown","city":"Dongara","email":"leonard.howard@kmail.com","mobile":917489351},
		{"Sno":322,"firstname":"Anna","lastname":"Parsons","jobtitle":"IT Systems Administrator","county":"Fairwick","city":"Burracoppin","email":"anna.parsons@kmail.com","mobile":840089203},
		{"Sno":323,"firstname":"Alexandra","lastname":"Martin","jobtitle":"E-Learning Specialist","county":"Blackden","city":"Saltwater River","email":"alexandra.martin@kmail.com","mobile":918696319},
		{"Sno":324,"firstname":"Abigail","lastname":"Gill","jobtitle":"HRD/Training and Development Manager","county":"Hedgebeach","city":"Murrawee","email":"abigail.gill@kmail.com","mobile":917091452},
		{"Sno":325,"firstname":"Cameron","lastname":"Cameron","jobtitle":"Organizational Development Director","county":"Janwick","city":"Vacy","email":"cameron.cameron@kmail.com","mobile":907182114},
		{"Sno":326,"firstname":"Austin","lastname":"Cornish","jobtitle":"Senior Programmer","county":"Norfield","city":"Melville Forest","email":"austin.cornish@kmail.com","mobile":811158477},
		{"Sno":327,"firstname":"Andrew","lastname":"Rees","jobtitle":"Vice President of Human Resources","county":"Oldcrest","city":"Saibai","email":"andrew.rees@kmail.com","mobile":845724165},
		{"Sno":328,"firstname":"Lucas","lastname":"Lewis","jobtitle":"Java Developer","county":"Aldmoor","city":"Bankstown","email":"lucas.lewis@kmail.com","mobile":784955719},
		{"Sno":329,"firstname":"Alison","lastname":"Hudson","jobtitle":"Software Quality Assurance Analyst","county":"Lightburn","city":"Dooralong","email":"alison.hudson@kmail.com","mobile":835194318},
		{"Sno":330,"firstname":"Jennifer","lastname":"Grant","jobtitle":"Information Technology Coordinator","county":"Courtmeadow","city":"Minore","email":"jennifer.grant@kmail.com","mobile":872846561},
		{"Sno":331,"firstname":"Samantha","lastname":"Ince","jobtitle":"Human Resources Champion","county":"Blueborough","city":"Clear Is. Wtrs","email":"samantha.ince@kmail.com","mobile":845169792},
		{"Sno":332,"firstname":"Carolyn","lastname":"Chapman","jobtitle":"Design Engineer","county":"Swynmarsh","city":"North Arm Cove","email":"carolyn.chapman@kmail.com","mobile":807064863},
		{"Sno":333,"firstname":"Jane","lastname":"Walker","jobtitle":"Benefits Officer","county":"Brightbrook","city":"Strathallan","email":"jane.walker@kmail.com","mobile":892093574},
		{"Sno":334,"firstname":"Jason","lastname":"Jones","jobtitle":"Chief Human Resources Officer","county":"Glassdeer","city":"Capalaba","email":"jason.jones@kmail.com","mobile":891321794},
		{"Sno":335,"firstname":"Cameron","lastname":"Metcalfe","jobtitle":"HRD/Training and Development Analyst","county":"Lochden","city":"Poruma","email":"cameron.metcalfe@kmail.com","mobile":858397283},
		{"Sno":336,"firstname":"Grace","lastname":"Arnold","jobtitle":"Trainer","county":"Rosewheat","city":"Malu","email":"grace.arnold@kmail.com","mobile":916139878},
		{"Sno":337,"firstname":"Sally","lastname":"Mathis","jobtitle":"Manager IS Risk and Compliance","county":"Applehurst","city":"Alligator Creek","email":"sally.mathis@kmail.com","mobile":790652332},
		{"Sno":338,"firstname":"Isaac","lastname":"Walker","jobtitle":"Safety Coordinator","county":"Southbay","city":"Lawrence","email":"isaac.walker@kmail.com","mobile":812096229},
		{"Sno":339,"firstname":"Amelia","lastname":"Anderson","jobtitle":"Assistant Product Manager","county":"Edgedell","city":"Girraween","email":"amelia.anderson@kmail.com","mobile":812511191},
		{"Sno":340,"firstname":"Trevor","lastname":"Mackay","jobtitle":"Social Media Marketing Coordinator ","county":"Courtbeach","city":"Oldina","email":"trevor.mackay@kmail.com","mobile":887025272},
		{"Sno":341,"firstname":"Emma","lastname":"Ball","jobtitle":"Human Resources Champion","county":"Eastmerrow","city":"Kamma","email":"emma.ball@kmail.com","mobile":859664396},
		{"Sno":342,"firstname":"Gordon","lastname":"Simpson","jobtitle":"Direct Salesperson","county":"Courthill","city":"Baddaginnie","email":"gordon.simpson@kmail.com","mobile":795746867},
		{"Sno":343,"firstname":"Lillian","lastname":"Grant","jobtitle":"Information Technology Manager","county":"Oldmaple","city":"Cape Clear","email":"lillian.grant@kmail.com","mobile":803832514},
		{"Sno":344,"firstname":"Sonia","lastname":"Hodges","jobtitle":"Applications Engineer","county":"Swyncrest","city":"Lambton","email":"sonia.hodges@kmail.com","mobile":786165137},
		{"Sno":345,"firstname":"Tracey","lastname":"May","jobtitle":"Engineering Executive","county":"Southhaven","city":"Goolgowi","email":"tracey.may@kmail.com","mobile":911967702},
		{"Sno":346,"firstname":"Molly","lastname":"Springer","jobtitle":"HR Manager Multi-site","county":"Starryglass","city":"Sutton","email":"molly.springer@kmail.com","mobile":874990879},
		{"Sno":347,"firstname":"Blake","lastname":"Smith","jobtitle":"Senior Software Engineer","county":"Wolfcastle","city":"Ashens","email":"blake.smith@kmail.com","mobile":830647567},
		{"Sno":348,"firstname":"James","lastname":"Mitchell","jobtitle":"Electrical Engineer","county":"Greycastle","city":"Teddywaddy","email":"james.mitchell@kmail.com","mobile":915986845},
		{"Sno":349,"firstname":"Jason","lastname":"Cornish","jobtitle":"Senior Process Engineer","county":"Coldwyvern","city":"Mount Elgin","email":"jason.cornish@kmail.com","mobile":777949639},
		{"Sno":350,"firstname":"Evan","lastname":"Henderson","jobtitle":"Civil Engineer","county":"Whitefair","city":"Musclebrook","email":"evan.henderson@kmail.com","mobile":840918576},
		{"Sno":351,"firstname":"Diane","lastname":"North","jobtitle":"Art Director","county":"Easthill","city":"Jarklin","email":"diane.north@kmail.com","mobile":843187310},
		{"Sno":352,"firstname":"Keith","lastname":"Henderson","jobtitle":"Senior Sales Representative","county":"Falconmarsh","city":"Binnum","email":"keith.henderson@kmail.com","mobile":781437262},
		{"Sno":353,"firstname":"Maria","lastname":"Welch","jobtitle":"Software Engineer","county":"Corville","city":"Glenquarry","email":"maria.welch@kmail.com","mobile":909952599},
		{"Sno":354,"firstname":"Tracey","lastname":"Berry","jobtitle":"HRD/Training and Development Vice President","county":"Greendell","city":"Tintinara","email":"tracey.berry@kmail.com","mobile":830593895},
		{"Sno":355,"firstname":"Diana","lastname":"Churchill","jobtitle":"Organizational Development Director","county":"Winterbank","city":"Wonga Park","email":"diana.churchill@kmail.com","mobile":901779930},
		{"Sno":356,"firstname":"Brian","lastname":"Brown","jobtitle":"Talent Acquisition Consultant","county":"Coldgold","city":"Yarlington","email":"brian.brown@kmail.com","mobile":854676768},
		{"Sno":357,"firstname":"Alexander","lastname":"Jackson","jobtitle":"Training and Technical Assistance Coordinator","county":"Oldmill","city":"Chowey","email":"alexander.jackson@kmail.com","mobile":798974280},
		{"Sno":358,"firstname":"Liam","lastname":"Fraser","jobtitle":"Senior Applications Engineer","county":"Eriden","city":"Mona Vale","email":"liam.fraser@kmail.com","mobile":814926319},
		{"Sno":359,"firstname":"Gavin","lastname":"Davies","jobtitle":"Licensing Engineer","county":"Woodley","city":"Marsden Park","email":"gavin.davies@kmail.com","mobile":820903880},
		{"Sno":360,"firstname":"Sean","lastname":"Robertson","jobtitle":"Senior Network Architect","county":"Faykeep","city":"Cooper","email":"sean.robertson@kmail.com","mobile":917797514},
		{"Sno":361,"firstname":"Deirdre","lastname":"Ince","jobtitle":"Front End Developer","county":"Lorlea","city":"Birchip","email":"deirdre.ince@kmail.com","mobile":789080082},
		{"Sno":362,"firstname":"Sarah","lastname":"Butler","jobtitle":"Information Technology Director","county":"Lochcrest","city":"Port Kembla","email":"sarah.butler@kmail.com","mobile":821033669},
		{"Sno":363,"firstname":"Carl","lastname":"Rutherford","jobtitle":"Staking Engineer","county":"Coldpond","city":"Kings Lake East","email":"carl.rutherford@kmail.com","mobile":796122532},
		{"Sno":364,"firstname":"Penelope","lastname":"Smith","jobtitle":"Healthcare Sales Representative","county":"Snowhall","city":"Norahville","email":"penelope.smith@kmail.com","mobile":804184655},
		{"Sno":365,"firstname":"Jennifer","lastname":"Ferguson","jobtitle":"Technical Operations Officer","county":"Springmount","city":"Craven","email":"jennifer.ferguson@kmail.com","mobile":781928914},
		{"Sno":366,"firstname":"Jan","lastname":"Clarkson","jobtitle":"Electronics Engineer (non-computer)","county":"Wildewheat","city":"Merriworth","email":"jan.clarkson@kmail.com","mobile":890385463},
		{"Sno":367,"firstname":"Michael","lastname":"May","jobtitle":"Human Resources and Safety Coordinator","county":"Valmeadow","city":"Silent Grove","email":"michael.may@kmail.com","mobile":859167265},
		{"Sno":368,"firstname":"Victor","lastname":"Jones","jobtitle":"Electro-Mechanical Engineer","county":"Fallcoast","city":"Yunta","email":"victor.jones@kmail.com","mobile":793297524},
		{"Sno":369,"firstname":"Amy","lastname":"Jones","jobtitle":"Licensing Engineer","county":"Belmount","city":"Euramilong","email":"amy.jones@kmail.com","mobile":892127323},
		{"Sno":370,"firstname":"Fiona","lastname":"Terry","jobtitle":"Assistant Brand Manager","county":"Orport","city":"Keilor","email":"fiona.terry@kmail.com","mobile":787849014},
		{"Sno":371,"firstname":"Audrey","lastname":"Peake","jobtitle":"eCommerce Marketing Specialist","county":"Woodtown","city":"Ravensfield","email":"audrey.peake@kmail.com","mobile":873533763},
		{"Sno":372,"firstname":"Sarah","lastname":"Mitchell","jobtitle":"Software Developer","county":"Bymount","city":"Wilroy","email":"sarah.mitchell@kmail.com","mobile":868780735},
		{"Sno":373,"firstname":"Bernadette","lastname":"Mills","jobtitle":"Industrial Engineer","county":"Icewater","city":"Mooyabil","email":"bernadette.mills@kmail.com","mobile":887414014},
		{"Sno":374,"firstname":"Gabrielle","lastname":"Springer","jobtitle":"Business Development Representative","county":"Valhall","city":"Bushy Park","email":"gabrielle.springer@kmail.com","mobile":779023085},
		{"Sno":375,"firstname":"Jane","lastname":"Vaughan","jobtitle":"Digital Brand Manager","county":"Maplemeadow","city":"Laceby","email":"jane.vaughan@kmail.com","mobile":862697682},
		{"Sno":376,"firstname":"Carolyn","lastname":"Mills","jobtitle":"Marketing Communications Manager","county":"Westerwinter","city":"Karoonda","email":"carolyn.mills@kmail.com","mobile":877254121},
		{"Sno":377,"firstname":"Michelle","lastname":"Chapman","jobtitle":"Senior Network Architect","county":"Beachston","city":"Saint Pauls","email":"michelle.chapman@kmail.com","mobile":843737663},
		{"Sno":378,"firstname":"Nathan","lastname":"Clark","jobtitle":"System Architect","county":"Summerville","city":"Warrah Creek","email":"nathan.clark@kmail.com","mobile":822913762},
		{"Sno":379,"firstname":"Faith","lastname":"Bell","jobtitle":"Human Resources Adviser","county":"Esterbrook","city":"Quindalup","email":"faith.bell@kmail.com","mobile":816651129},
		{"Sno":380,"firstname":"Joanne","lastname":"Edmunds","jobtitle":"Staffing Consultant","county":"Highwyvern","city":"Coronet Bay","email":"joanne.edmunds@kmail.com","mobile":919672917},
		{"Sno":381,"firstname":"Lisa","lastname":"Wright","jobtitle":"Website Content Administrator","county":"Silverfalcon","city":"Warrandyte South","email":"lisa.wright@kmail.com","mobile":805217567},
		{"Sno":382,"firstname":"Ava","lastname":"Young","jobtitle":"HRIS Manager","county":"Summerbush","city":"Castle Hill","email":"ava.young@kmail.com","mobile":785615978},
		{"Sno":383,"firstname":"Gavin","lastname":"Hamilton","jobtitle":"HRD/Training and Development Manager","county":"Edgecliff","city":"Bamboo Mining Centre","email":"gavin.hamilton@kmail.com","mobile":782243597},
		{"Sno":384,"firstname":"Leonard","lastname":"Sutherland","jobtitle":"Associate Product Manager","county":"Westercrest","city":"Dorset","email":"leonard.sutherland@kmail.com","mobile":804356159},
		{"Sno":385,"firstname":"Alan","lastname":"Ogden","jobtitle":"Engineering Clerk","county":"Esterlyn","city":"Midwest","email":"alan.ogden@kmail.com","mobile":796582693},
		{"Sno":386,"firstname":"Kimberly","lastname":"McDonald","jobtitle":"Cost Engineer","county":"Fieldpond","city":"Warmun","email":"kimberly.mcdonald@kmail.com","mobile":817247755},
		{"Sno":387,"firstname":"Karen","lastname":"Blake","jobtitle":"Creative Assistant","county":"Fallmount","city":"Norman Park","email":"karen.blake@kmail.com","mobile":791683259},
		{"Sno":388,"firstname":"Dominic","lastname":"Turner","jobtitle":"Territory Manager","county":"Glasshurst","city":"Glenburn","email":"dominic.turner@kmail.com","mobile":780572177},
		{"Sno":389,"firstname":"Isaac","lastname":"Dowd","jobtitle":"Director of Engineering","county":"Corhall","city":"Kotta","email":"isaac.dowd@kmail.com","mobile":778158734},
		{"Sno":390,"firstname":"Jake","lastname":"Clark","jobtitle":"Job Posting Specialist","county":"Ormount","city":"Inveralochy","email":"jake.clark@kmail.com","mobile":871039007},
		{"Sno":391,"firstname":"Audrey","lastname":"Wright","jobtitle":"Support Specialist","county":"Westermont","city":"Euroley","email":"audrey.wright@kmail.com","mobile":899943070},
		{"Sno":392,"firstname":"Blake","lastname":"Lambert","jobtitle":"Associate Director of Human Resources","county":"Rockpond","city":"Slade Point","email":"blake.lambert@kmail.com","mobile":869130934},
		{"Sno":393,"firstname":"Warren","lastname":"Lewis","jobtitle":"Union Organizer","county":"Dorton","city":"Mosman Park","email":"warren.lewis@kmail.com","mobile":883246555},
		{"Sno":394,"firstname":"Trevor","lastname":"McLean","jobtitle":"Commissioning Engineer","county":"Morpond","city":"Talban","email":"trevor.mclean@kmail.com","mobile":819996122},
		{"Sno":395,"firstname":"Stephen","lastname":"Davidson","jobtitle":"Systems Engineer","county":"Whiteham","city":"Soansville","email":"stephen.davidson@kmail.com","mobile":912613131},
		{"Sno":396,"firstname":"Jack","lastname":"Hughes","jobtitle":"1st Shift HR Representative","county":"Magedell","city":"North Kununoppin","email":"jack.hughes@kmail.com","mobile":879133224},
		{"Sno":397,"firstname":"Lillian","lastname":"Johnston","jobtitle":"Safety Compliance and Recruitment Specialist","county":"Springston","city":"Donvale","email":"lillian.johnston@kmail.com","mobile":884748202},
		{"Sno":398,"firstname":"Alexander","lastname":"Morrison","jobtitle":"E-Learning Manager","county":"Eastedge","city":"Kooralgin","email":"alexander.morrison@kmail.com","mobile":906444225},
		{"Sno":399,"firstname":"Eric","lastname":"Vance","jobtitle":"Biomedical Engineer","county":"Flowercliff","city":"Hawkins Creek","email":"eric.vance@kmail.com","mobile":827428041},
		{"Sno":400,"firstname":"Mary","lastname":"Martin","jobtitle":"Construction Engineer","county":"Spellland","city":"Spreyton","email":"mary.martin@kmail.com","mobile":889467623},
		{"Sno":401,"firstname":"Lily","lastname":"Ross","jobtitle":"Telecommunications Specialist","county":"Pondhollow","city":"Streetsville","email":"lily.ross@kmail.com","mobile":807153039},
		{"Sno":402,"firstname":"Robert","lastname":"Ball","jobtitle":"Senior System Analyst","county":"Bushedge","city":"Legal","email":"robert.ball@kmail.com","mobile":778152121},
		{"Sno":403,"firstname":"Dylan","lastname":"Gill","jobtitle":"Industrial Sales Representative","county":"Eastlyn","city":"Gagnon","email":"dylan.gill@kmail.com","mobile":877503825},
		{"Sno":404,"firstname":"Sophie","lastname":"Davidson","jobtitle":"Biomedical Engineer","county":"Crystalbarrow","city":"Wekweti","email":"sophie.davidson@kmail.com","mobile":917360218},
		{"Sno":405,"firstname":"Carl","lastname":"Bower","jobtitle":"Electronics Engineer (non-computer)","county":"Goldford","city":"Spillimacheen","email":"carl.bower@kmail.com","mobile":807963674},
		{"Sno":406,"firstname":"Ella","lastname":"Poole","jobtitle":"Talent Acquisition Manager","county":"Wildewynne","city":"McPherson","email":"ella.poole@kmail.com","mobile":901049610},
		{"Sno":407,"firstname":"Stewart","lastname":"Glover","jobtitle":"Email Marketer","county":"Nornesse","city":"Reynolds","email":"stewart.glover@kmail.com","mobile":787573654},
		{"Sno":408,"firstname":"Kylie","lastname":"Short","jobtitle":"Marketing Communications Specialist","county":"Silverhaven","city":"Mobile","email":"kylie.short@kmail.com","mobile":881811009},
		{"Sno":409,"firstname":"Paul","lastname":"Roberts","jobtitle":"Controls Engineer","county":"Mistden","city":"Kanata","email":"paul.roberts@kmail.com","mobile":811313837},
		{"Sno":410,"firstname":"Eric","lastname":"Rutherford","jobtitle":"Welding Engineer","county":"Faydale","city":"Gabriola","email":"eric.rutherford@kmail.com","mobile":847735010},
		{"Sno":411,"firstname":"Michael","lastname":"Cornish","jobtitle":"Chief Information Officer (CIO) ","county":"Brightspell","city":"Kakawis","email":"michael.cornish@kmail.com","mobile":868284172},
		{"Sno":412,"firstname":"Penelope","lastname":"Brown","jobtitle":"Materials Engineer","county":"Wildecrystal","city":"Puvirnituq","email":"penelope.brown@kmail.com","mobile":908055587},
		{"Sno":413,"firstname":"Owen","lastname":"McDonald","jobtitle":"Social Media Marketing Coordinator ","county":"Dragonbridge","city":"Rutherglen","email":"owen.mcdonald@kmail.com","mobile":875501813},
		{"Sno":414,"firstname":"Mary","lastname":"Mackenzie","jobtitle":"Field Service Engineer","county":"Coldwall","city":"Zealandia","email":"mary.mackenzie@kmail.com","mobile":871980290},
		{"Sno":415,"firstname":"Rachel","lastname":"White","jobtitle":"Frontend Engineer","county":"Pinetown","city":"Torrance","email":"rachel.white@kmail.com","mobile":790511677},
		{"Sno":416,"firstname":"Bernadette","lastname":"Bell","jobtitle":"Protection Engineer","county":"Northpond","city":"Shawenegan","email":"bernadette.bell@kmail.com","mobile":844689633},
		{"Sno":417,"firstname":"Lauren","lastname":"Dyer","jobtitle":"Financial Sales Assistant","county":"Aldden","city":"Coboconk","email":"lauren.dyer@kmail.com","mobile":790689314},
		{"Sno":418,"firstname":"Joan","lastname":"Wallace","jobtitle":"Medical Sales Representative","county":"Linbeach","city":"Como","email":"joan.wallace@kmail.com","mobile":796099474},
		{"Sno":419,"firstname":"Michael","lastname":"Dickens","jobtitle":"Senior Network Architect","county":"Mistston","city":"Edgerton","email":"michael.dickens@kmail.com","mobile":810725950},
		{"Sno":420,"firstname":"Stewart","lastname":"Paige","jobtitle":"Relay Engineer","county":"Esterhollow","city":"Kawene","email":"stewart.paige@kmail.com","mobile":919436174},
		{"Sno":421,"firstname":"Sophie","lastname":"Knox","jobtitle":"HRD/Training and Development Specialist","county":"Vertwind","city":"Vaudreuil","email":"sophie.knox@kmail.com","mobile":851618161},
		{"Sno":422,"firstname":"Amelia","lastname":"Peake","jobtitle":"Content Marketing Manager","county":"Greywald","city":"Lovettville","email":"amelia.peake@kmail.com","mobile":824885505},
		{"Sno":423,"firstname":"John","lastname":"McGrath","jobtitle":"Technical Support Engineer","county":"Mallowmill","city":"Kelligrews","email":"john.mcgrath@kmail.com","mobile":915023296},
		{"Sno":424,"firstname":"Adrian","lastname":"Hart","jobtitle":"Junior Software Engineer","county":"Clearedge","city":"Jordan","email":"adrian.hart@kmail.com","mobile":802121006},
		{"Sno":425,"firstname":"Kimberly","lastname":"Payne","jobtitle":"Aerospace Engineer","county":"Vertcastle","city":"Kogluktok","email":"kimberly.payne@kmail.com","mobile":884081796},
		{"Sno":426,"firstname":"Lillian","lastname":"Hardacre","jobtitle":"Packaging Engineer","county":"Iceston","city":"Ogema","email":"lillian.hardacre@kmail.com","mobile":832187609},
		{"Sno":427,"firstname":"Nicholas","lastname":"Vaughan","jobtitle":"Human Resources Clerk","county":"Oldwitch","city":"Bauline","email":"nicholas.vaughan@kmail.com","mobile":843646190},
		{"Sno":428,"firstname":"Connor","lastname":"Rees","jobtitle":"Organizational Development Analyst","county":"Wintervale","city":"Kindersley","email":"connor.rees@kmail.com","mobile":854731486},
		{"Sno":429,"firstname":"Jasmine","lastname":"Mackay","jobtitle":"IT Systems Administrator","county":"Ormont","city":"Sidney","email":"jasmine.mackay@kmail.com","mobile":864740594},
		{"Sno":430,"firstname":"Emma","lastname":"Rutherford","jobtitle":"Network Systems Administrator","county":"Westtown","city":"Hydraulic","email":"emma.rutherford@kmail.com","mobile":900357762},
		{"Sno":431,"firstname":"Gordon","lastname":"Paterson","jobtitle":"Union Organizer","county":"Shadeshore","city":"Lanoraie","email":"gordon.paterson@kmail.com","mobile":864530989},
		{"Sno":432,"firstname":"Leonard","lastname":"Paige","jobtitle":"eCommerce Recruiter - HR Coordinator","county":"Lochville","city":"Blackie","email":"leonard.paige@kmail.com","mobile":811915706},
		{"Sno":433,"firstname":"Alan","lastname":"Hudson","jobtitle":"Human Resources Coach","county":"Lightbush","city":"Ormstown","email":"alan.hudson@kmail.com","mobile":850540390},
		{"Sno":434,"firstname":"Alan","lastname":"Slater","jobtitle":"Field Service Engineer","county":"Buttercrystal","city":"Hawkesbury","email":"alan.slater@kmail.com","mobile":852780477},
		{"Sno":435,"firstname":"Richard","lastname":"Nash","jobtitle":"Substation Engineer","county":"Blueelf","city":"Caraquet","email":"richard.nash@kmail.com","mobile":784428810},
		{"Sno":436,"firstname":"Nicholas","lastname":"Oliver","jobtitle":"Manufacturing Engineer","county":"Lorcastle","city":"Lamont","email":"nicholas.oliver@kmail.com","mobile":783253792},
		{"Sno":437,"firstname":"Frank","lastname":"Paterson","jobtitle":"Senior Electrical Engineer","county":"Bluebarrow","city":"Trespassey","email":"frank.paterson@kmail.com","mobile":787996398},
		{"Sno":438,"firstname":"Phil","lastname":"Kelly","jobtitle":"Benefits and Work Comp Manager","county":"Rayborough","city":"Griffins","email":"phil.kelly@kmail.com","mobile":910155578},
		{"Sno":439,"firstname":"Jason","lastname":"Clarkson","jobtitle":"Art Director","county":"Landmoor","city":"Glasnevin","email":"jason.clarkson@kmail.com","mobile":892993371},
		{"Sno":440,"firstname":"Joan","lastname":"Walker","jobtitle":"Senior Network Engineer","county":"Redness","city":"Broderick","email":"joan.walker@kmail.com","mobile":901374601},
		{"Sno":441,"firstname":"Olivia","lastname":"Hunter","jobtitle":"Human Resources Adviser","county":"Whitecoast","city":"Midway","email":"olivia.hunter@kmail.com","mobile":890759115},
		{"Sno":442,"firstname":"Charles","lastname":"White","jobtitle":"Human Resources and Safety Coordinator","county":"Dorden","city":"Geraldton","email":"charles.white@kmail.com","mobile":803015407},
		{"Sno":443,"firstname":"Sally","lastname":"Ball","jobtitle":"Human Resources Director","county":"Ironwinter","city":"Valleyfield","email":"sally.ball@kmail.com","mobile":790591613},
		{"Sno":444,"firstname":"Karen","lastname":"Bond","jobtitle":"Business Development Representative","county":"Lightmerrow","city":"Keppel","email":"karen.bond@kmail.com","mobile":788557660},
		{"Sno":445,"firstname":"Sophie","lastname":"Forsyth","jobtitle":"Naval Architect","county":"Elftown","city":"Napinka","email":"sophie.forsyth@kmail.com","mobile":892361433},
		{"Sno":446,"firstname":"David","lastname":"Arnold","jobtitle":"Administrative Assistant","county":"Clearwilde","city":"Dalton","email":"david.arnold@kmail.com","mobile":804614709},
		{"Sno":447,"firstname":"Dorothy","lastname":"Young","jobtitle":"Training Coordinator - Multi Unit","county":"Highsummer","city":"Skidegate","email":"dorothy.young@kmail.com","mobile":911282003},
		{"Sno":448,"firstname":"Megan","lastname":"Hudson","jobtitle":"Database Administrator","county":"Elfville","city":"Delhi","email":"megan.hudson@kmail.com","mobile":801112827},
		{"Sno":449,"firstname":"Joshua","lastname":"Coleman","jobtitle":"Research and Development Engineer","county":"Rosedeer","city":"Berwick","email":"joshua.coleman@kmail.com","mobile":869127366},
		{"Sno":450,"firstname":"Brian","lastname":"Hamilton","jobtitle":"Employee Relations Associate Counsel","county":"Iceview","city":"Smoky","email":"brian.hamilton@kmail.com","mobile":805144378},
		{"Sno":451,"firstname":"Sonia","lastname":"Mills","jobtitle":"Human Resources Officer","county":"Stoneley","city":"Lintlaw","email":"sonia.mills@kmail.com","mobile":914115270},
		{"Sno":452,"firstname":"Dan","lastname":"Hunter","jobtitle":"Director of Technology","county":"Blackspring","city":"Bradford","email":"dan.hunter@kmail.com","mobile":910653594},
		{"Sno":453,"firstname":"Chloe","lastname":"Clark","jobtitle":"Management Information Systems Director","county":"Pinemoor","city":"Caslan","email":"chloe.clark@kmail.com","mobile":788247591},
		{"Sno":454,"firstname":"Alexander","lastname":"Arnold","jobtitle":"Human Resources and Safety Coordinator","county":"Osthill","city":"Lasqueti","email":"alexander.arnold@kmail.com","mobile":856715326},
		{"Sno":455,"firstname":"Peter","lastname":"Paterson","jobtitle":"Health and Safety Engineer","county":"Wildecourt","city":"Erwood","email":"peter.paterson@kmail.com","mobile":906051086},
		{"Sno":456,"firstname":"Lisa","lastname":"Martin","jobtitle":"Metallurgical Engineer","county":"Swynshore","city":"Shere","email":"lisa.martin@kmail.com","mobile":849216972},
		{"Sno":457,"firstname":"Donna","lastname":"Bailey","jobtitle":"Director of Employment and Recruiting","county":"Newhaven","city":"Napinka","email":"donna.bailey@kmail.com","mobile":789020193},
		{"Sno":458,"firstname":"Ava","lastname":"Dyer","jobtitle":"Investments Representative","county":"Strongcrystal","city":"Queenstown","email":"ava.dyer@kmail.com","mobile":799876446},
		{"Sno":459,"firstname":"Sophie","lastname":"Powell","jobtitle":"Marketing Specialist","county":"Wyvernbridge","city":"Boutiliers Point","email":"sophie.powell@kmail.com","mobile":790428112},
		{"Sno":460,"firstname":"Kimberly","lastname":"Ogden","jobtitle":"Assistant Director, Employment","county":"Easthall","city":"Westview","email":"kimberly.ogden@kmail.com","mobile":875662403},
		{"Sno":461,"firstname":"Joe","lastname":"Morgan","jobtitle":"HR Administrative Assistant","county":"Shadowbarrow","city":"Lemsford","email":"joe.morgan@kmail.com","mobile":797332921},
		{"Sno":462,"firstname":"Megan","lastname":"Butler","jobtitle":"Plastics Engineer","county":"Shadowwell","city":"Dakin","email":"megan.butler@kmail.com","mobile":884170148},
		{"Sno":463,"firstname":"Brian","lastname":"Wallace","jobtitle":"Account Coordinator","county":"Glasscliff","city":"Norgate","email":"brian.wallace@kmail.com","mobile":816530897},
		{"Sno":464,"firstname":"Tracey","lastname":"Forsyth","jobtitle":"Marketing Specialist","county":"Deepcoast","city":"Stirling","email":"tracey.forsyth@kmail.com","mobile":818900545},
		{"Sno":465,"firstname":"Paul","lastname":"Gray","jobtitle":"Senior Database Administrator","county":"Beechhedge","city":"Alsask","email":"paul.gray@kmail.com","mobile":895037245},
		{"Sno":466,"firstname":"Dorothy","lastname":"Clark","jobtitle":"Computer Systems Manager","county":"Aldmist","city":"Anson","email":"dorothy.clark@kmail.com","mobile":850983032},
		{"Sno":467,"firstname":"Charles","lastname":"Avery","jobtitle":"Geological Engineer","county":"Lorpond","city":"Bend","email":"charles.avery@kmail.com","mobile":847350384},
		{"Sno":468,"firstname":"Brandon","lastname":"Paterson","jobtitle":"Senior Employee Benefits Manager","county":"Whitebeach","city":"Carmanville","email":"brandon.paterson@kmail.com","mobile":899650174},
		{"Sno":469,"firstname":"Wanda","lastname":"Duncan","jobtitle":"Training and Technical Assistance Coordinator","county":"Janham","city":"Vonda","email":"wanda.duncan@kmail.com","mobile":793749356},
		{"Sno":470,"firstname":"Samantha","lastname":"Peters","jobtitle":"Information Technology Director","county":"Ironash","city":"Ikaluktutiak","email":"samantha.peters@kmail.com","mobile":802793762},
		{"Sno":471,"firstname":"Kimberly","lastname":"Hughes","jobtitle":"Organizational Development Administrator","county":"Lightshade","city":"Leeville","email":"kimberly.hughes@kmail.com","mobile":872969505},
		{"Sno":472,"firstname":"Dorothy","lastname":"James","jobtitle":"Specialty Sales Representative","county":"Summercastle","city":"Welland","email":"dorothy.james@kmail.com","mobile":888765226},
		{"Sno":473,"firstname":"Anne","lastname":"Jones","jobtitle":"Human Resources Manager","county":"Raymount","city":"Trochu","email":"anne.jones@kmail.com","mobile":883028901},
		{"Sno":474,"firstname":"Fiona","lastname":"Baker","jobtitle":"Software Engineer","county":"Southlake","city":"Sicamous","email":"fiona.baker@kmail.com","mobile":804164890},
		{"Sno":475,"firstname":"Joshua","lastname":"Knox","jobtitle":"E-Learning Executive Director","county":"Milldell","city":"Capreol","email":"joshua.knox@kmail.com","mobile":850469446},
		{"Sno":476,"firstname":"Anthony","lastname":"Oliver","jobtitle":"Piping Stress Engineer","county":"Oakpond","city":"Tuxedo","email":"anthony.oliver@kmail.com","mobile":907411413},
		{"Sno":477,"firstname":"Maria","lastname":"Mackay","jobtitle":"Sales Engineer","county":"Goldview","city":"Tribune","email":"maria.mackay@kmail.com","mobile":899778571},
		{"Sno":478,"firstname":"Jennifer","lastname":"Nolan","jobtitle":"Chief Engineer","county":"Oakdale","city":"Nuwata","email":"jennifer.nolan@kmail.com","mobile":801439077},
		{"Sno":479,"firstname":"Carolyn","lastname":"Kerr","jobtitle":"Drafting Technician","county":"Stronggriffin","city":"Highridge","email":"carolyn.kerr@kmail.com","mobile":829733636},
		{"Sno":480,"firstname":"Irene","lastname":"Gill","jobtitle":"Assistant HR Manager","county":"Goldedge","city":"Ripples","email":"irene.gill@kmail.com","mobile":879839104},
		{"Sno":481,"firstname":"Andrea","lastname":"Harris","jobtitle":"Director of Employment Services","county":"Fairbush","city":"Bigolet","email":"andrea.harris@kmail.com","mobile":874970429},
		{"Sno":482,"firstname":"Robert","lastname":"McLean","jobtitle":"HRD/Training and Development Manager","county":"Northbay","city":"Stry","email":"robert.mclean@kmail.com","mobile":787923156},
		{"Sno":483,"firstname":"Keith","lastname":"Ellison","jobtitle":"Marketing Manager","county":"Dracfield","city":"Crofton","email":"keith.ellison@kmail.com","mobile":782163744},
		{"Sno":484,"firstname":"William","lastname":"Slater","jobtitle":"Frontend Engineer","county":"Southsilver","city":"Arichat","email":"william.slater@kmail.com","mobile":808459859},
		{"Sno":485,"firstname":"Stephanie","lastname":"Clark","jobtitle":"Drafting Technician","county":"Goldrose","city":"Busby","email":"stephanie.clark@kmail.com","mobile":913212081},
		{"Sno":486,"firstname":"Wendy","lastname":"Glover","jobtitle":"Employee Relations Manager","county":"Wooddale","city":"Barwick","email":"wendy.glover@kmail.com","mobile":841166866},
		{"Sno":487,"firstname":"Audrey","lastname":"Mills","jobtitle":"Technical Support Engineer","county":"Starryville","city":"Wakeham","email":"audrey.mills@kmail.com","mobile":837304065},
		{"Sno":488,"firstname":"Elizabeth","lastname":"Arnold","jobtitle":"Human Resources Representative","county":"Ashcliff","city":"Skowman","email":"elizabeth.arnold@kmail.com","mobile":821476250},
		{"Sno":489,"firstname":"Joshua","lastname":"Thomson","jobtitle":"Technical Recruiter","county":"Highhaven","city":"Suquash","email":"joshua.thomson@kmail.com","mobile":893049249},
		{"Sno":490,"firstname":"Gordon","lastname":"Nolan","jobtitle":"Information Technology Coordinator","county":"Foxhaven","city":"Minnedosa","email":"gordon.nolan@kmail.com","mobile":874015147},
		{"Sno":491,"firstname":"Karen","lastname":"MacDonald","jobtitle":"Desktop Support Specialist","county":"Ironshore","city":"Resolution","email":"karen.macdonald@kmail.com","mobile":915420539},
		{"Sno":492,"firstname":"Madeleine","lastname":"Davidson","jobtitle":"Enterprise Resources Planning Representative","county":"Rosemist","city":"Eldorado","email":"madeleine.davidson@kmail.com","mobile":905967637},
		{"Sno":493,"firstname":"Victoria","lastname":"Murray","jobtitle":"Help Desk Technician","county":"Winternesse","city":"Suffield","email":"victoria.murray@kmail.com","mobile":838270556},
		{"Sno":494,"firstname":"Molly","lastname":"Avery","jobtitle":"Data Quality Manager","county":"Shoreburn","city":"Bouchard","email":"molly.avery@kmail.com","mobile":812050724},
		{"Sno":495,"firstname":"Liam","lastname":"Underwood","jobtitle":"HRD/Training and Development Administrator","county":"Irondeer","city":"Simpson","email":"liam.underwood@kmail.com","mobile":887515647},
		{"Sno":496,"firstname":"Neil","lastname":"Edmunds","jobtitle":"Human Resources Team Leader","county":"Wyvernhaven","city":"Chibougamau","email":"neil.edmunds@kmail.com","mobile":785416643},
		{"Sno":497,"firstname":"Zoe","lastname":"Kerr","jobtitle":"Training and Technical Assistance Coordinator","county":"Easthedge","city":"Verlo","email":"zoe.kerr@kmail.com","mobile":867792254},
		{"Sno":498,"firstname":"Gordon","lastname":"Wilson","jobtitle":"Senior Network System Administrator","county":"Fairfall","city":"Joussard","email":"gordon.wilson@kmail.com","mobile":881190077},
		{"Sno":499,"firstname":"Lucas","lastname":"Ogden","jobtitle":"SCADA Engineer","county":"Newfort","city":"Haileybury","email":"lucas.ogden@kmail.com","mobile":815045166},
		{"Sno":500,"firstname":"Colin","lastname":"Quinn","jobtitle":"Human Resources Payroll and Benefits Specialist","county":"Wellbourne","city":"Vaudreuil","email":"colin.quinn@kmail.com","mobile":789417004},
		{"Sno":501,"firstname":"Joan","lastname":"Lewis","jobtitle":"Assistant Product Manager","county":"Snowwyvern","city":"Ashburton","email":"joan.lewis@kmail.com","mobile":897611608},
		{"Sno":502,"firstname":"Isaac","lastname":"Ross","jobtitle":"Media Buyer","county":"Southcastle","city":"Wycombe","email":"isaac.ross@kmail.com","mobile":905025780},
		{"Sno":503,"firstname":"Neil","lastname":"McLean","jobtitle":"Engineering Technician","county":"Crystalbell","city":"Hayton","email":"neil.mclean@kmail.com","mobile":917762696},
		{"Sno":504,"firstname":"Robert","lastname":"Harris","jobtitle":"Media Relations Director","county":"Dorbarrow","city":"Lydbury","email":"robert.harris@kmail.com","mobile":910204510},
		{"Sno":505,"firstname":"Ava","lastname":"Ellison","jobtitle":"Senior Security Specialist","county":"Silvercastle","city":"Baldock","email":"ava.ellison@kmail.com","mobile":921269111},
		{"Sno":506,"firstname":"Jack","lastname":"McLean","jobtitle":"Computer Systems Manager","county":"Redmarsh","city":"Bangor","email":"jack.mclean@kmail.com","mobile":835263955},
		{"Sno":507,"firstname":"Liam","lastname":"Watson","jobtitle":"Planning Engineer","county":"Winterley","city":"Monmouth","email":"liam.watson@kmail.com","mobile":904271003},
		{"Sno":508,"firstname":"Charles","lastname":"Edmunds","jobtitle":"Human Resources Technician","county":"Wheatcastle","city":"York","email":"charles.edmunds@kmail.com","mobile":919632006},
		{"Sno":509,"firstname":"Amelia","lastname":"Berry","jobtitle":"Retail Sales Representative","county":"Courtnesse","city":"Hatfield","email":"amelia.berry@kmail.com","mobile":902382084},
		{"Sno":510,"firstname":"Stephen","lastname":"Lambert","jobtitle":"Social Media Marketing Analyst ","county":"Redcoast","city":"Oswestry","email":"stephen.lambert@kmail.com","mobile":780875853},
		{"Sno":511,"firstname":"Oliver","lastname":"Fraser","jobtitle":"Computer Systems Manager","county":"Rayton","city":"Tintagel","email":"oliver.fraser@kmail.com","mobile":859056394},
		{"Sno":512,"firstname":"Kevin","lastname":"Clarkson","jobtitle":"Desktop Support Specialist","county":"Wildemeadow","city":"Flint","email":"kevin.clarkson@kmail.com","mobile":779856402},
		{"Sno":513,"firstname":"Donna","lastname":"Arnold","jobtitle":"Engineering Executive","county":"Millland","city":"Petersfield","email":"donna.arnold@kmail.com","mobile":894896297},
		{"Sno":514,"firstname":"Piers","lastname":"Cameron","jobtitle":"Associate Product Manager","county":"Glasscrystal","city":"Raby","email":"piers.cameron@kmail.com","mobile":833627105},
		{"Sno":515,"firstname":"David","lastname":"Wilson","jobtitle":"Sales Engineer","county":"Lochcliff","city":"Kirdford","email":"david.wilson@kmail.com","mobile":916127489},
		{"Sno":516,"firstname":"Jake","lastname":"Lyman","jobtitle":"Assistant HR Manager","county":"Summerhall","city":"Chillingham","email":"jake.lyman@kmail.com","mobile":861878709},
		{"Sno":517,"firstname":"Lily","lastname":"Tucker","jobtitle":"Human Resources Champion","county":"Lightmallow","city":"Roehester","email":"lily.tucker@kmail.com","mobile":874425914},
		{"Sno":518,"firstname":"Eric","lastname":"Lewis","jobtitle":"Senior Benefits Manager","county":"Goldshore","city":"Starford","email":"eric.lewis@kmail.com","mobile":806175805},
		{"Sno":519,"firstname":"Rachel","lastname":"Sharp","jobtitle":"Petroleum Engineer","county":"Dracnesse","city":"Manorbier","email":"rachel.sharp@kmail.com","mobile":826902208},
		{"Sno":520,"firstname":"Emma","lastname":"Lewis","jobtitle":"Route Sales Representative","county":"Fairsea","city":"Raglan","email":"emma.lewis@kmail.com","mobile":851145059},
		{"Sno":521,"firstname":"Robert","lastname":"MacDonald","jobtitle":"Promotions Director","county":"Fairland","city":"Grimsby","email":"robert.macdonald@kmail.com","mobile":890134791},
		{"Sno":522,"firstname":"Victor","lastname":"Parsons","jobtitle":"Technical Operations Officer","county":"Redwinter","city":"Hope","email":"victor.parsons@kmail.com","mobile":813480981},
		{"Sno":523,"firstname":"Sarah","lastname":"Campbell","jobtitle":"Recruiting and Sourcing Coordinator","county":"Mapleedge","city":"Kingsbridge","email":"sarah.campbell@kmail.com","mobile":824443738},
		{"Sno":524,"firstname":"Alan","lastname":"Arnold","jobtitle":"Marketing Communications Coordinator","county":"Witchhill","city":"Elsing","email":"alan.arnold@kmail.com","mobile":794166271},
		{"Sno":525,"firstname":"Vanessa","lastname":"Dickens","jobtitle":"Human Resources Technician","county":"Byice","city":"Romsey","email":"vanessa.dickens@kmail.com","mobile":842525526},
		{"Sno":526,"firstname":"Sonia","lastname":"Hamilton","jobtitle":"Manager IS Risk and Compliance","county":"Swynhill","city":"Malton","email":"sonia.hamilton@kmail.com","mobile":815964264},
		{"Sno":527,"firstname":"Bella","lastname":"Morrison","jobtitle":"Technical Operations Officer","county":"Brightton","city":"Llanstephan","email":"bella.morrison@kmail.com","mobile":844119237},
		{"Sno":528,"firstname":"Ava","lastname":"Jackson","jobtitle":"Telecommunications Engineer","county":"Marshdell","city":"Helens","email":"ava.jackson@kmail.com","mobile":849566144}
	];

	$scope.changeList = function() {
		console.log('changeList called 111');
		$scope.employees = [];
		$scope.employees = $scope.employeesModified;
		$scope.pagination.reload($scope.employeesModified);
	}

}]);

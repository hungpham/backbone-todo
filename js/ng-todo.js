// TODO Global
var TODO = window.TODO || {};
l10n = {
	'GUEST': 'Guest',
	'KEY_NAME': 'Key name',
	dates: {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		clear: "Clear"
	}
};
/*table-example*/
//angular.module("angular-table-example", ["angular-table", "angular-tabs"]);

angular.module('todo', ['ngCookies', 'angular-table'])
	.controller('UserCtrl', function($cookies, $http, $scope){
		/*---------User begin------------*/
	  	$scope.sigined = false;
	  	$scope.username = l10n['GUEST'];
	  	$scope.user = {
	  		username: "",
	  		password: ""
	  	};

	  	
	   $scope.signinStatus = function(){
	   		return $scope.sigined;
	   }
	   
	   	$scope.userSignin = function(){
	    	$scope.username = $scope.user.username;
	    	$scope.sigined = true;
	    	if($('#modal-user-signin').length > 0) $('#modal-user-signin').modal('hide');	
	    	if($scope.user.remember) {
	    		$cookies.username = $scope.user.username;
	    		$cookies.password = $scope.user.password;
	    	}
	    	
	   };

	   $scope.userSignout = function(){
	    	$scope.username = l10n['GUEST'];
	    	$scope.sigined = false;
	    	if($('#modal-user-signin').length > 0) $('#modal-user-signin').modal('hide');	
	    	
	    	$cookies.username = undefined;
	    	$cookies.password = undefined;
	    	
	   };

	   $scope.userCookie = function(){
	   		var username = $cookies.username;
	   		if(typeof(username) === 'string' && username != '') {
		    	$scope.username = $cookies.username;
		    	$scope.sigined = true;
	    	} else {
	    		$scope.sigined = false;
	    	}
	   };

	   $scope.userCookie();

	  	/*---------User end------------*/
	})	
	.controller('TodoCtrl',  function($http, $scope){
		$scope.config = {
		    itemsPerPage: 2,
		    fillLastPage: true
		  };

		  
		$scope.todos = [
			{text:'learn bootstrap', status:'done', due: '1/18/2013', cat: 'workplace'},
			{text:'learn angular', status:'unplanned', due: '3/22/2014', cat: 'workplace'},
			{text:'build Todo sample', status:'in_progress', due: '3/18/2014', cat: 'workplace'},
			{text:'learn foudation 2', status:'planned', due: '5/15/2014', cat: 'workplace'},
			{text:'learn angular 3', status:'planned', due: '4/5/2014', cat: 'workplace'},
			{text:'build Todo sample 3', status:'done', due: '5/16/2014', cat: 'workplace'},

			{text:'learn foudation', status:'planned', due: '3/22/2013', cat: 'homeplace'},
			{text:'build an angular app 2', status:'planned', due: '4/22/2014', cat: 'homeplace'},
			{text:'learn bootstrap 2', status:'done', due: '1/18/2013', cat: 'homeplace'},
			{text:'learn angular 2', status:'unplanned', due: '1/22/2014', cat: 'homeplace'},
			{text:'build Todo sample 2', status:'in_progress', due: '1/16/2014', cat: 'homeplace'},
			{text:'build an angular app 2', status:'planned', due: '3/17/2014', cat: 'homeplace'},
			{text:'learn bootstrap 3', status:'done', due: '1/18/2013', cat: 'homeplace'},
			{text:'learn foudation 3', status:'in_progress', due: '3/15/2013', cat: 'homeplace'},
			{text:'build an angular app 3', status:'done', due: '4/22/2014', cat: 'homeplace'}
		];
		
		$scope.categories = [
			{'cat_id': 'workplace', 'cat_name': 'Workplace'},
			{'cat_id': 'homeplace', 'cat_name': 'Homeplace'}
		]
		
		//$scope.todosByFilter = [];
		$scope.predicate  = '-due';
		$scope.todosByFilter = $scope.todos;
		$scope.categoryCurrent = 'workplace';

		$scope.todosByArchive = [];
		$scope.archives = {};
		$scope.todoItemNew = {
			text: 	null,
			status: 	null,
			due: 	null,
			cat: 	null
		};

		$scope.addTodo = function() {
			/*
			$scope.todos.push({
				text: 		$scope.todoItemNew.text,
				status: 	$scope.todoItemNew.status,
				due: 		$scope.todoItemNew.due,
				cat: 		$scope.todoItemNew.cat
			});	
			*/
			if($('#modal-todo-add').length > 0) $('#modal-todo-add').modal('hide');	
			
			/*
			*/
			$http.post('data/data-add.json', $scope.todoItemNew)
				.success(function(){					
					
					//$scope.$apply(function(){
					setTimeout(function(){
						console.log($scope.todoItemNew);

						$scope.todos.push({
							text: 	$scope.todoItemNew.text,
							status: 	$scope.todoItemNew.status,
							due: 	$scope.todoItemNew.due,
							cat: 	$scope.todoItemNew.cat
						});	
						
						/*Update filter by category*/
						$scope.filterByCategory($scope.categoryCurrent);

						
						/*Update archive*/
						$scope.archives = $scope.updateArchives($scope.todos)

						/*Reset*/
						$scope.todoItemNew.text = '';
						$scope.todoItemNew.due = '';

					}, 10);
						
					//});
				});
			
			

			
		};

	  $scope.remaining = function() {
		 
	  };
	  
	  $scope.checkboxAll = function() {
		angular.forEach($scope.todosByFilter, function(item) {
		  if(item.status === 'done') {
	  		if(item.status_temp !== '') {
	  			item.status = item.status_temp;
	  			item.status_temp = '';
	  		}
	  	} else {
	  		if(item.status_temp !== '') {
	  			item.status = item.status_temp;
	  		} else {
	  			item.status_temp = item.status;
	  			item.status = 'done';
	  		}
	  	}
		});
	  };
	  
	  $scope.checkboxItem = function(item) {
	  	if(item.status === 'done') {
	  		if(item.status_temp !== '') {
	  			item.status = item.status_temp;
	  			item.status_temp = '';
	  		}
	  	} else {
	  		if(item.status_temp !== '') {
	  			item.status = item.status_temp;
	  		} else {
	  			item.status_temp = item.status;
	  			item.status = 'done';
	  		}
	  	}
	  };
	  
	  $scope.classStatus = function(item){
	  	if(item.status_temp != '') {
	  		return item.status_temp;
	  	} else {
	  		return item.status;
	  	}
	  }

	  
	  $scope.filterByCategory = function(type) {
		$scope.todosByFilter = [];
		angular.forEach($scope.todos, function(todo) {
		  if (todo.cat == type) {
		  	todo.status_temp = '';
		  	$scope.todosByFilter.push(todo);
		  }		  
		});
		$('.nav-cat li').removeClass('active');
		$('.nav-cat li[data-type="'+ type +'"]').addClass('active');
		$scope.categoryCurrent = type;		

	  };

	  $scope.filterByArchive = function(_year, _month) {
		_year = _year || '';
		_month = _month || '';
		$scope.todosByFilter = [];
		angular.forEach($scope.todos, function(todo) {
		  	var arrDate = todo.due.split('/');
		  	var year = arrDate[2];
		  	var month = arrDate[0] - 1;
			if(_month == '') _month = month;
		  if (year == _year && month == _month) {
		  	$scope.todosByArchive.push(todo);
		  }		  
		});
		$scope.todosByFilter = $scope.todosByArchive;
	  }; 

	  
	  /*Schedule Metrics*/
	  $scope.metrics = function(type) {
		var count_task_done = 0;
		var count_task_deadline = 0;
		var count_task_overdue = 0;

		var now =  new Date();
		angular.forEach($scope.todosByFilter, function(todo) {

		});
		return (count/$scope.todosByFilter.length) * 100;
	  };
	  

	  $scope.metricsDone = function() {
		var count = 0;
		var now =  new Date();
		angular.forEach($scope.todosByFilter, function(todo) {
		  count += todo.status == 'done' ? 1 : 0;
		});

		return (count/$scope.todosByFilter.length) * 100;
	  };

	  $scope.metricsDeadline = function() {
		var count = 0;
		
		angular.forEach($scope.todosByFilter, function(todo) {
			var now =  new Date();
			var millisecondsPerDay = 24 * 60 * 60 * 1000;
			var nextDay = now.getTime() + millisecondsPerDay*7;
			var arrDate = todo.due.split('/');
			var dueDay = new Date(arrDate[2], arrDate[0]-1, arrDate[1], now.getHours(), now.getMinutes(), now.getSeconds());
			if(dueDay.getTime() <= nextDay) {				
		  		count += todo.status != 'done' ? 1 : 0;
			}
		});	
		return (count/$scope.todosByFilter.length) * 100;
	  };

	  $scope.metricsOverdue = function() {
		var count = 0;
		angular.forEach($scope.todosByFilter, function(todo) {
		  	var now =  new Date();
			var arrDate = todo.due.split('/');
			var dueDay = new Date(arrDate[2], arrDate[0]-1, arrDate[1], now.getHours(), now.getMinutes(), now.getSeconds());
			if(dueDay.getTime() < now) {				
		  		count += todo.status != 'done' ? 1 : 0;
			}  
		});

		return (count/$scope.todosByFilter.length) * 100;
	  };

		
		/*Archive*/	

		
		$scope.archiveBlank = {
			text: '',
			count: 0,
			months: [
				{
					count: 0,
					text: ''
				}
			]
		};
		/**/

		$scope.archives = [];

		$scope.updateArchives = function(todos) {
			var archives = [];
			angular.forEach(todos, function(todo, index) {
					var _year = todo.due.split('/')[2];
					var _month = todo.due.split('/')[0] -1;
					archives = $scope.doArchive(archives, _year, _month, index);
			}); 
			return archives;
		};
		$scope.doArchive = function(archives, _year, _month, index) {
			if(archives.length == 0){
				archives.push({
					text: _year,
					count: 1,
					months: [
						{
							count: 1,
							text: _month
						}
					]
				});
				//first archive
				return archives;
			}
			var forEachYearGoing = true;
			angular.forEach(archives, function(archive, i) {
				if(forEachYearGoing) {
					if(archive.text == _year ) {
						var forEachMonthGoing = true;
						angular.forEach(archive.months, function(month, j) {
							if(month.text == _month ) {
								month.count++;
								forEachMonthGoing = false;
							}
						});
						if(forEachMonthGoing){
							archive.months.push({
								count: 1,
								text: _month
							});
						}
						archive.count++;
						forEachYearGoing = false;
					}
				}
				 
			});
			if(forEachYearGoing) {
				//console.log("archive pushed");
				archives.push({
					text: _year,
					count: 1,
					months: [
						{
							count: 1,
							text: _month
						}
					]
				});
				forEachYearGoing = false;
			}
			return archives;
		};


		  

		$scope.archives = $scope.updateArchives($scope.todos);
	}).filter('month_locales', function() {
		return function(str, uppercase) {
		
		  if(typeof str != 'undefined') {
			  var out = l10n.dates.months[parseInt(str)];
			  //console.log(str + '||' + out);
			  // conditional based on optional argument
			  if (uppercase) {
				out = out.toUpperCase();
			  }
			  return out;
		  }
		};
	  });
/*customize module*/
TODO.initElements = function(){
	/*Datepicker*/
	$('.datepicker').datepicker({
		autoclose: true,
		todayBtn: true,	
	    language: "vi"
	});

	/*Checkbox All handel*/
	$('.chk-all').on('change', function(){
		var chkName = $(this).attr('name');
		if($(this).is(':checked')){
			$('.chk-item[name="' + chkName +'"]').prop('checked', true);
		} else {
			$('.chk-item[name="' + chkName +'"]').prop('checked', false);
		}
	});

	$('.chk-item').on('change', function(){
		var chkName = $(this).attr('name');
		if($('.chk-item[name="' + chkName +'"]').length == $('.chk-item[name="' + chkName +'"]:checked').length){
			$('.chk-all[name="' + chkName +'"]').prop('checked', true);
		} else {
			$('.chk-all[name="' + chkName +'"]').prop('checked', false);
		}
	});


}
$(document).ready(function(){
	TODO.initElements();
});
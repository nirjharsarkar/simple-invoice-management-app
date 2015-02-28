(function(){  
	

angular.module('hello', [ 'ngRoute', 'ngResource', 'ngLocale' ])
.config(function($routeProvider) {
	
//	route config
	$routeProvider.when('/', {
		templateUrl : '/partials/templates/home.html',
		controller : 'homeCtrl'
	}).when('/phoneType', {
		templateUrl : '/partials/templates/phoneType/phoneType.html',
		controller : 'phoneTypeListCtrl'
	}).when('/phoneType/new', {
		templateUrl : '/partials/templates/phoneType/phoneTypeNewForm.html',
		controller : 'phoneTypeNewCtrl'
	}).when('/phoneType/edit', {
		templateUrl : '/partials/templates/phoneType/phoneTypeEditForm.html',
		controller : 'phoneTypeEditCtrl'
	}).when('/login', {
		templateUrl : '/partials/templates/login/login.html',
		controller : 'loginCtrl'
	}).otherwise('/');
	})
	
//	services for /api/
	.factory('PhoneType', ['$resource',
	function($resource){
	    return $resource('api/phoneType/:id', {}, {
	    	query: { isArray:false }
	    	//delete: {url:'url', method:'DELETE'}
	    });
	}])
	  
//	controllers attached to routes	
//	controllers attached to routes	
	.controller('phoneTypeListCtrl', ['$scope', 'PhoneType', '$http', '$location', '$route', function($scope, PhoneType, $http, $location, $route) {
	PhoneType.query(function(data){
		$scope.phoneTypeList = data;
		});	
	$scope.deleteItem = function(urlReference){
		$http.delete(urlReference).success(function(){
			$route.reload();
		});
	};
	//PhoneType.delete({  });
	//console.log(phoneTypeList);	
		}])
		.controller('phoneTypeNewCtrl',['$scope','PhoneType', '$location', function($scope, PhoneType, $location) {
			//$scope.phoneTypeNew = {};
			$scope.phoneTypeForm = function(){
				PhoneType.save($scope.phoneTypeNew);
				$location.path('/phoneType')
			};
			}])
			
			
//	.controller('phoneTypeListCtrl', ['$scope', 'PhoneType', function($scope, PhoneType) {
//		var phoneType = PhoneType.get({ id: $scope.id }, function() {
//		    //console.log(phoneType);
//		  });
//		 // $scope.orderProp = 'age';
//		}])
	.controller('homeCtrl', function($scope, $http) {
	$http.get('/resource/').success(function(data) {
		$scope.greeting = data;

	})
	})
	.controller('loginCtrl',
		function($rootScope, $scope, $http, $location) {
		
		$scope.credentials = {};
		$scope.login = function() {
			$http.post('login', $.param($scope.credentials), {
				headers : {
					"content-type" : "application/x-www-form-urlencoded"
				}
			}).success(function(data) {
				$rootScope.authenticate(function() {
					if ($rootScope.authenticated) {
						$location.path("/");
						$scope.error = false;
					} else {
						$location.path("/login");
						$scope.error = true;
					}
				});
			}).error(function(data) {
				$location.path("/login");
				$scope.error = true;
				$rootScope.authenticated = false;
			})
		};
})

//	custom directives
.directive('navigationBar', function(){
	return{
		
		restrict: 'E',
		templateUrl: '/partials/templates/navigationBar.html',
		controller: 
			function($rootScope, $scope, $http, $location, $route, $window){
			
				// auth check on page reload
				$rootScope.authenticate = 
				function(callback) {
				$http.get('user').success(function(data) {
					if (data.name) {
						$rootScope.authenticated = true;
						$rootScope.authority = data.authorities[0].authority;
					} else {
						$rootScope.authenticated = false;
					}
					callback && callback();
				}).error(function() {
					$rootScope.authenticated = false;
					callback && callback();
				});
				}	
					
				$rootScope.authenticate();
				
				
				//logout function
				this.logout = function() {
					$http.post('logout', {}).success(function() {
						$rootScope.authenticated = false;
						$window.location.href = '/';
					}).error(function(data) {
						$rootScope.authenticated = false;
					});
				}

				
				//manu buttons
				//this.asd = $location.url()
				//this.selectedMenu = "home";
				/*
				this.selectMenu = function(newMenu){
					this.selectedMenu = newMenu;
				};
				
				this.isSelected = function(currentMenu){
					if(this.selectedMenu===currentMenu){
						return true
					}else{
						return false;
					}
				};*/
				//alert($location.path());
				//test
				this.isActive = function(route) {
			        return route === $location.path();
			    };
			},
		controllerAs: 'navBar'
	}
})
;

})();

/* sample data from PricipalController at /user/
 * {
 * "details":{"remoteAddress":"0:0:0:0:0:0:0:1","sessionId":"EC2C5162D9C8A5A2A13F7023DF2F8BCD"},
 * "authorities":[{"authority":"ROLE_USER"}], "authenticated":true,
 * "principal":{ "password":null, "username":"user", "authorities":[{
 * "authority":"ROLE_USER"}], "accountNonExpired":true, "accountNonLocked":true,
 * "credentialsNonExpired":true, "enabled":true }, "credentials":null,
 * "name":"user"}
 * 
 */
/*.controller('navigation',
		function($rootScope, $scope, $http, $location) {
		var authenticate = function(callback) {
		$http.get('user').success(function(data) {
			if (data.name) {
				$rootScope.authenticated = true;
				$rootScope.role = data.principal.authorities[0];
			} else {
				$rootScope.authenticated = false;
				$rootScope.role = '';
			}
			callback && callback();
		}).error(function() {
			$rootScope.authenticated = false;
			$rootScope.role = '';
			callback && callback();
		});
	
		}

		authenticate();
	
		$scope.credentials = {};
	
		$scope.login = function() {
			$http.post('login', $.param($scope.credentials), {
				headers : {
					"content-type" : "application/x-www-form-urlencoded"
				}
			}).success(function(data) {
				authenticate(function() {
					if ($rootScope.authenticated) {
						$location.path("/");
						$scope.error = false;
					} else {
						$location.path("/login");
						$scope.error = true;
					}
				});
			}).error(function(data) {
				$location.path("/login");
				$scope.error = true;
				$rootScope.authenticated = false;
			})
		};
	
		$scope.logout = function() {
			$http.post('logout', {}).success(function() {
				$rootScope.authenticated = false;
				$location.path("/");
			}).error(function(data) {
				$rootScope.authenticated = false;
			});
		}

})*/
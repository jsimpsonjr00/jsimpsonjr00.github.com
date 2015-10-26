angular.module('AngularApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when( '/', {
				//templateUrl:	'app/views/projects/featured.html'
				redirectTo: "/projects/featured"
			})
			.when('/about', {
				templateUrl: 	'app/views/about.html'
			})
			.when('/contact', {
				templateUrl: 	'app/views/contact.html'
			})
			.when('/proj', {
				templateUrl: 	'views/auth-required.html'
			})
			.when( '/app/posts/:postURL*', {
				templateUrl: 'app/views/posts.html',
				controller: function ( $scope, $routeParams ) {
					$scope.$routeParams = $routeParams;
					
					$scope.getPostURL = function ( ) {
						return "/app/posts/" + $scope.$routeParams.postURL;
					}
				}
			})
			/*.when( '/login', {
				templateUrl: 	'views/login.html'
			})*/
			.when( '/projects/demos', {
				templateUrl:	'app/views/projects/demos.html'
			})
			.when( '/projects/demos/:demoID', {
				templateUrl: 'app/views/demo.html',
				controller: function( $scope, $routeParams ){
					$scope.$routeParams = $routeParams;
					
					$scope.getDemoURL = function ( ) {
						return "/app/views/projects/demos/" + $scope.$routeParams.demoID + ".html";
					};
				}
			})
			.when( '/projects/featured', {
				templateUrl:	'app/views/projects/featured.html'
			})
			.when( '/projects/personal', {
				templateUrl:	'app/views/projects/personal.html'
			})
			.when( '/projects/chrome-extensions', {
				templateUrl:	'app/views/projects/chrome-extensions.html'
			})
			.otherwise({ //defacto home right now
				templateUrl:	'app/views/404.html'
			});
	});
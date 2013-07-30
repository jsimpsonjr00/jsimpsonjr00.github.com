var app = angular.module( "app", [ "jsLocationSpy" ] );

app.value( "Demos", {
	"jsMaxLength" : {
		id: "jsMaxLength",
		type: "directive",
		subtitle: "Enforce a maximum input length"
	},
	"jsInputCounter" : {
		id: 		"jsInputCounter",
		type: 		"directive",
		subtitle: 	"Counts the length of an input against the js-maxlength"
	},
	"jsLocationSpy" : {
		id:			"jsLocationSpy",
		type:		"directive",
		subtitle:	"Sets child A element active when a route change matches the href"
	}
});
app.controller( "MainMenuCtrl", function( $scope, Demos ) {
	$scope.Demos = Demos;
});
app.config( [ 
	'$routeProvider',
	function( $routeProvider ) {
		$routeProvider.
			when( '/demo/:demoName', {
				templateUrl: "partials/demo.html",
				controller: function( $scope, $routeParams ) {
					$scope.markupSRC = $("#demo").html();
					$scope.scriptSRC = "";
					$.getScript( "js/" + $routeParams.demoName + ".js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
					
					switch( $routeParams.demoName ) {
						default: 
							break;
					}
				}
			}).
			when( '/jsMaxLength/', {
				templateUrl: 'partials/jsMaxLength.html',
				controller: function ( $scope, $routeParams, Demos, $location ) {
					$scope.Demo = Demos[ $location.path().replace(/\//g, "") ]; 
					$scope.demo = {
						text: ""
					};
					$scope.scriptSRC = "";
					$scope.markupSRC = $("#demo").html().replace(/\t/g,"  ");
					
					$.getScript( "js/jsMaxLength.js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
				}
			} ).
			when( '/jsInputCounter/', {
				templateUrl: 'partials/jsInputCounter.html',
				controller: function ( $scope, $routeParams, Demos, $location) {
					$scope.Demo = Demos[ $location.path().replace(/\//g, "") ];
					$scope.demo = {
						text: ""
					};
					$scope.scriptSRC = "";
					$scope.markupSRC = "<js-input-counter input='#demoText' text='{{demo.text}}'></js-input-counter>";
					
					$.getScript( "js/jsInputCounter.js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
				}
			} ).
			when( '/jsLocationSpy/', {
				templateUrl: 'partials/jsLocationSpy.html',
				controller: function ( $scope, $routeParams, Demos, $location) {
					$scope.Demo = Demos[ $location.path().replace(/\//g, "") ];
					$scope.demo = {
						text: ""
					};
					$scope.scriptSRC = "";
					$scope.markupSRC = "<ul class='nav' ng-controller='MainMenuCtrl' js-location-spy >" +
							"<li ng-repeat='demo in Demos'>" +		
			    			"<a href='#/{{demo.id}}/'>{{demo.id}}</a>" +
			    		"</li>" +
			    	"</ul>";
					
					$.getScript( "js/jsLocationSpy.js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
				}
			} ).
			when( '/weekly/:storeId/', {
				templateUrl: 'partials/deals.html',
				controller: function ( $scope, $routeParams ) {
					
				}
			} ).
			otherwise( { 
			//	redirectTo: '/daily/woot/' 
			} );
	 	}
] );
var app = angular.module( "app", [ "jsStringFilters", "jsLocationSpy", "jsMaxLength", "jsInputCounter" ] );

app.value( "Demos", {
	"directive": {
		"jsMaxLength" : {
			id: "jsMaxLength",
			subtitle: "Enforce a maximum input length"
		},
		"jsInputCounter" : {
			id: 		"jsInputCounter",
			subtitle: 	"Counts the length of an input against the js-maxlength"
		},
		"jsLocationSpy" : {
			id:			"jsLocationSpy",
			subtitle:	"Sets child A element active when a route change matches the href"
		}
	},
	"filter": {
		"jsStringFilters.js": {
			id: "jsStringFilters",
			subtitle: "modify strings before they reach the view"
		}
	}/*,
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
	}*/
});
app.controller( "MainMenuCtrl", function( $scope, Demos ) {
	$scope.Demos = Demos;
});
app.config( [ 
	'$routeProvider',
	function( $routeProvider ) {
		$routeProvider.
			when( '/directiveS/:demoName/', {
				templateUrl: "partials/demo.html",
				controller: function( $scope, $routeParams, Demos, $location ) {
					//WIP to standardize if possible
					if( Demos["directive"] ) { //$routeParams.type] ) {
						$scope.Demo = Demos[$routeParams.type][ $routeParams.demoName.replace(/\//g, "") ];
						
						if( $scope.Demo !== undefined ) {
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
							
						} else { //invalid url get out
							
						}
					} else { //invalid url get out
						
					}
				}
			}).
			when( '/directive/jsMaxLength/', {
				templateUrl: 'partials/jsMaxLength.html',
				controller: function ( $scope, $routeParams, Demos, $location ) {
					$scope.Demo = Demos.directive[ $location.path().replace(/\//g, "") ]; 
					
					$scope.scriptSRC = "";
					$scope.markupSRC = $("#demo").html().replace(/\t/g,"  ");
					
					$.getScript( "js/jsMaxLength.js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
				}
			} ).
			when( '/directive/jsInputCounter/', {
				templateUrl: 'partials/jsInputCounter.html',
				controller: function ( $scope, $routeParams, Demos, $location) {
					$scope.Demo = Demos.directive[ $location.path().replace(/\//g, "") ];
					
					$scope.scriptSRC = "";
					$scope.markupSRC = "<js-input-counter input='#demoText' text='{{demo.text}}'></js-input-counter>";
					
					$.getScript( "js/jsInputCounter.js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
				}
			} ).
			when( '/directive/jsLocationSpy/', {
				templateUrl: 'partials/jsLocationSpy.html',
				controller: function ( $scope, $routeParams, Demos, $location) {
					$scope.Demos = Demos;
					$scope.Demo = Demos.directive[ $location.path().replace(/\//g, "") ];
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
			when( '/filter/jsStringFilters/', {
				templateUrl: "partials/filter/jsStringFilters.html",
				controller: function( $scope ) {
					$scope.markup = {
						camelToCaps: "{{ 'jsStringFilters' | camelToCapitals }}",
						jsCurrency: "{{ '10,000' | jsCurrency }}",
						clickToSee: '{{ "undefined" | jsCurrency | clickToSee  }}'
					};
					
					$.getScript( "js/filter/jsStringFilters.js", function ( script ) {
						$scope.scriptSRC = script;
						$scope.$digest();
					});
				}
			}).
			when( '/weekly/:storeId/', {
				templateUrl: 'partials/deals.html',
				controller: function ( $scope, $routeParams ) {
					
				}
			} ).
			when( '/', {
				templateUrl: 'partials/landing-page.html',
				controller: function ( $scope ) {
					
				}
			}).
			otherwise( { 
			//	redirectTo: '/daily/woot/'
				templateUrl: 'partials/error.html',
				controller: function ( $scope ) {
			        console.log( "otherwise" );
			    }
			} );
	 	}
] );
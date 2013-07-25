var app = angular.module( "app", [] );

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
				controller: function ( $scope, $routeParams ) {
					var demoName = "inputControl";
					
					$scope.demo = {
						text: ""
					};
					$scope.scriptSRC = "";
					$scope.markupSRC = $("#demo").html();
					
					$.getScript( "js/jsMaxLength.js", function ( script ) {
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
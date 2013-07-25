var app = angular.module( "app", [] );

app.config( [ 
	'$routeProvider',
	function( $routeProvider ) {
		$routeProvider.
			when( '/inputCounter/', {
				templateUrl: 'partials/inputCounter.html',
				controller: function ( $scope, $routeParams ) {
					$scope.demo = {
						text: ""
					};
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
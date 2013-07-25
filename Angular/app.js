var app = angular.module( "app", [] );

angApp.config( [ 
	'$routeProvider',
	function( $routeProvider ) {
		$routeProvider.
			when( '/inputCounter/', {
				templateUrl: 'partials/inputCounter.html',
				controller: function ( $scope, $routeParams ) {
					
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
angular.module("AngularApp")
	.controller( "ContactCtrl", function ( $scope, $http, $sanitize, $window ) {
		//Extend modal behavior so that it can scroll on mobiles
		var $modal 	= $( "#contact-modal"),
			$body	= $( "body" );
		
		$modal.on( "show", function () {
			$modal.parent().show();
			$body.css( "overflow", "hidden" );
		});
		$modal.on( "hide", function () {
			$modal.parent().hide();
			$body.css( "overflow", "auto" );
		});
		
		$scope.success 	= false;
		$scope.error	= false;
		
		$scope.submit = function () {
			$scope.success 	= false;
			$scope.error	= false;
			
			if( $scope.email && $scope.message ) {
				$http( { 
					method: "POST", 
					url: 	"https://js-test-app.firebaseio.com/contact.json",
					data: 	JSON.stringify( { 
						email:		$sanitize( $scope.email ),
						other:		$sanitize( $scope.other	),
						message:	$sanitize( $scope.message )
					})
				} )
				.success( function( data, status, headers, config) {
					console.log( data );
					$scope.email 	= "";
					$scope.other 	= "";
					$scope.message	= "";
					
					$scope.success = true;
					
					//auto hide after 2 seconds
					$window.setTimeout( function () {
						$modal.modal( 'hide' );
						$scope.success = false;
						$scope.$digest();
					},
					2000 );
				})
				.error(function(data, status, headers, config) { 
					$scope.error	= true;
				});
			}
		};
	});
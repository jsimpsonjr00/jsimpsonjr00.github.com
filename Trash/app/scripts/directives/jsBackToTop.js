angular.module( "AngularApp" )
	.directive('jsBackToTop',  function(  ) {
		return {
		    restrict: 'A',
		    link: function( $scope, $element ) {
		    	$element.addClass( "back-to-top" );
		    	//THIS HAS A jQuery Dependency!!
		    	var $body = $( "body" );
		    	
		        $element.on( "click", function () {
		        	$( "body" ).animate( { scrollTop: 0 }, "slow" );
		        });
		    }
		};
	});
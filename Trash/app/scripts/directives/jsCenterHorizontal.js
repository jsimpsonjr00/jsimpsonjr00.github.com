angular.module( "AngularApp" )
	.directive('jsCenterHorizontal', [ '$location', function( $location ) {
		return {
		    restrict: 'A',
		    link: function( $scope, element ) {
		    	var $ele = $( element ),
		    		$parent	= $( $ele.parent() );
		    	
		    	$ele.css( "position", "absolute" );
		    	$parent.css( "position" ) == "static" ? $parent.css( "position", "relative" ) : null;
		    	
		    	$ele.css("left", ( $parent.width() / 2 ) - ( $ele.width() / 2 ) );
		    	
		    	$(window).resize(function(){
		    		$ele.css("left", ( $parent.width() / 2 ) - ( $ele.width() / 2 ) );
		    	});
		    }
		};
	} ] );
angular.module( "jsLocationSpy", [] )
	.directive('jsLocationSpy', [ '$location', function( $location ) {
		return {
		    restrict: 'A',
		    link: function( $scope, element ) {
		        var $ul = $( element ),
		        	$active = null,
		        	linkMap = {};
		        
		        function setActive( newPath ) {
		        	var $links = $ul.find( "a" );
		        	$active.removeClass( "active" );
		        	
		        	$links.each(function() {
			        	var $link 	= $(this),
			        		href 	= $link.attr('href').replace( "#", "" ); //remove leading #
			          	
			        	if( href === newPath ) {
			        		$active ? $active.removeClass( "active" ) : null;
			        		$active = $link.addClass( "active" );
			        		return false; //break out of each
			        	}
			        });
		        }
		
		        $scope.$location = $location;
		        $scope.$watch( '$location.path()', function ( newPath ) {
		        	setActive( newPath );
		        });

		        $(document).ready( function (  ) { //init once the dom is ready
		        	setActive( $location.path() );
		        });
		    }
		};
	} ] );
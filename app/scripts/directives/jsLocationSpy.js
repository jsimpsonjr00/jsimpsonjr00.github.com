angular.module( "AngularApp" )
	.directive('jsLocationSpy', [ '$location', function( $location ) {
		return {
		    restrict: 'A',
		    link: function( $scope, element ) {
		        var $ul = $( element ),
		        	$active = $ul.find("a.active"),
		        	linkMap = {};
		        
		        function setActive( newPath ) {
		        	var $links = $ul.find( "a" );
		        	$active ? $active.removeClass( "active" ).parent().removeClass( "active" ) : null;
		        	
		        	$links.each(function() {
			        	var $link 	= $(this),
			        		href 	= $link.attr('href').replace( "#", "" ); //remove leading #
			          	
			        	if( href === newPath ) {
			        		//$active ? $active.removeClass( "active" ).parent().removeClass( "active" ) : null;
			        		
			        		$active = $link.addClass( "active" );
			        		$active.parent().addClass( "active" ); //for bootstrap compatibility
			        		
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
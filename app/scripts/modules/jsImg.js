'use strict';

angular.module( 'js.Img', [] )
	.value( "jsBootstrapBreaks", { //predefined breaks based on Twitter Bootstrap 3
		suffix: ["xs", "sm", "md", "lg"],
		minWidth: [0, 768, 992, 1200]
	})
	.factory( "jsResponsiveValue", function( jsBootstrapBreaks ) {
		var breaks = jsBootstrapBreaks;
		return {
			getValue: function( element, prefix ) { //optional prefix for attr specifying source. e.g. bg-src-xs, bg-src-sm, etc.
				var src = undefined;
				prefix ? null : prefix = "src-"; //default prefix if one isn't supplied. e.g. src-xs, src-sm, etc.
				
				for( var i = breaks.minWidth.length -1 ; i >= 0; i-- ) {
					var breakSrc = element.attr( prefix + breaks.suffix[i] );
					if( document.body.clientWidth > breaks.minWidth[i] && breakSrc ) {
						src = breakSrc;
						break;
					}
				}
				return src;
			}
		}
	})
	.factory( "$jsDebounce", function ( $timeout ) {
		function debouncer( todo, milli ) {
			var promise = null;
			
			this.go = function( ) {
				promise ? $timeout.cancel( promise ) : null;
				promise = $timeout( todo, milli );
			};
		}
		return {
			newDebouncer: function( todo, milli ) {
				return new debouncer( todo, milli )
			}
		};
	})
	.directive( 'jsRespond', function( $window, jsResponsiveValue, $jsDebounce ) {
		return {
			restrict: 'A',
			link: function( $scope, element, attrs ) {
				var split = element.attr( "js-respond" ).split( ":" ); //split the responsive config
				var op, attr, prefix, debouncer;
				
				function setSrc( ) {
					var value = jsResponsiveValue.getValue( element, prefix );
					if( value ) {
						element[op]( attr, jsResponsiveValue.getValue( element, prefix ) );
					} else {
						element[op]( attr, "" );
					}
				}
				
				if( split.length === 3 ) {
					op		= split[0];
					attr 	= split[1];
					prefix	= split[2] + "-";
					
					if( element[op] ) { //only proceed if a valid jqlite operation is specified
						debouncer = $jsDebounce.newDebouncer( setSrc, 100 ); //create a debouncer for responding to window resize
						element[op]( attr, jsResponsiveValue.getValue( element, prefix ) ); 
						
						angular.element( $window ).on( 'resize', function() {
							debouncer.go( ); //100ms debounce on resizes
					    });
					}
				}
			}
		};
	})
	.directive( 'jsBootstrapBackgroundImg', function( $window, jsResponsiveValue, $jsDebounce ) {
		return {
			restrict: 'A',
			link: function( $scope, element, attrs ) {
				var debouncer = $jsDebounce.newDebouncer( setSrc, 100 ); //create a debouncer for responding to window resize
				element.css( "background-image", "url(" + jsResponsiveValue.getValue( element, "bg-src-" ) + ")" ); //set the src before hitting the dom with an img element
				
				function setSrc( ) {
					element.css( "background-image", "url(" + jsResponsiveValue.getValue( element, "bg-src-" ) + ")" );
				}
				angular.element( $window ).on( 'resize', function() {
					debouncer.go( ); //100ms debounce on resizes
			    });
			}
		};
	})
	.directive('jsBootstrapImg', function( $window, jsResponsiveValue, $jsDebounce ) {
		//Responsive images based on Twitter Bootstrap 3 mobile first breaks
		//Matches the largest image specified based on the break width of the document body width
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			compile: function( element, attrs ) {
				element.attr( "src", jsResponsiveValue.getValue( element ) ); //set the src before hitting the dom with an img element
				
				return function( $scope, element ) { //link function
					var debouncer = $jsDebounce.newDebouncer( setSrc, 100 ); //create a debouncer for responding to window resize
					$scope.src = element.attr( "src" );
					
					function setSrc( ) {
						$scope.src = jsResponsiveValue.getValue( element );
						element.attr( "src", $scope.src );
					}
					angular.element( $window ).on( 'resize', function() {
						debouncer.go( ); 
				    });
				};
			},
			template: "<img ng-show='src'>"
		};
	});
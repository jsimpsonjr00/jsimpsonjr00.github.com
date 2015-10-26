angular.module( "AngularApp" )
	.directive('jsMarkdown', function() {
	    var converter = new Showdown.converter();
	    var template = "<div ng-model='markdown' ng-bind-html-unsafe='markdown'></div>"
	    return {
	        restrict: 'E',
	        template: template,
	       //scope: { model: '='},
	        /*controller: function( $scope, $element ){
	        	var markdown 	= $element.text();
	        	$scope.markdown = converter.makeHtml( $scope.model );
	        	
	        	$scope.$watch( $scope.model, function( data ){
                    $scope.markdown = ( data ) ? converter.makeHtml(data) : '';
                });
            },*/
	        compile: function(tElement, tAttrs, transclude){
	            var markdown = tElement.text();
	
	            return function( $scope, element, attrs ) {
	                $scope.markdown = converter.makeHtml(markdown);
	
	                $scope.$watch( tAttrs.model, function( data ){
	                    $scope.markdown = ( data ) ? converter.makeHtml(data) : '';
	                });
	            }
	        }
	    }
	});
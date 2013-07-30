app.directive( 'jsInputCounter', function () {
	return {
		restrict: "E",
		scope: {
			text: "@"
		},
		replace: true,
		template: "<span>{{ text.length }} / {{ jsMaxlength }}</span>",
		link: function( $scope, $element, attrs ) {
			var $input = $( attrs.input );
			if( $input.length > 0 ) {
				$scope.jsMaxlength = $input.attr( "js-maxlength" );
			} else {
				$scope.jsMaxlength = "";
			}
			
		}
	};
});
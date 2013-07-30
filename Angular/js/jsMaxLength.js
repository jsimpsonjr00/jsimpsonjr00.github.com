app.directive('jsMaxlength', function() {
	return {
		restrict: "A",
		require: 'ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			var maxlength = Number( attrs.jsMaxlength );
			
			function fromUser( text ) {
				var transformedInput = text;
				
				if( text.length > maxlength ) {
					transformedInput = text.substring( 0, maxlength );
					ngModelCtrl.$setViewValue( transformedInput );
					ngModelCtrl.$render();
				} 
		    	return transformedInput;
		  	}
			ngModelCtrl.$parsers.push( fromUser );
		}
	}; 
});
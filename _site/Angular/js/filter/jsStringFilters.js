angular.module('jsStringFilters', [])
	.filter('camelToCapitals', function() {
		return function(input) {
			return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
		}
	})
	.filter( 'jsCurrency', function () {
		return function ( input ) {
			var temp = String( input ).replace( "$", "" ).replace( ",", "" );
			if( isNaN( temp ) ) {
				temp = "";
			} else {
				temp = "$" + temp;
			}
			return temp;
		}
	})
	.filter( 'clickToSee', function ( ) {
		return function ( input ) {
			return input ? input : "Click to See";
		}
	});
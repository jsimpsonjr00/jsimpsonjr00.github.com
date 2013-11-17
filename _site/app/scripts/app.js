angular.module( "AngularApp", [ 'ngRoute', 'ngSanitize' ]);

angular.module( "AngularApp" ).directive('script', function() {
		return { 
		  	restrict: 'E',
		    scope: false,
		    link: function(scope, elem, attr) {
		    if (attr.type=='text/javascript-lazy') {
		    	if( attr.src ) {
		    		$(elem).insertAfter( "<script src='" + attr.src + "'></script>" );
		    	} else { //inline js
		    		var code = elem.text();
		    		var f = new Function(code);
			    	f();
		    	}
		    	
	    	}
	    }
	}
});
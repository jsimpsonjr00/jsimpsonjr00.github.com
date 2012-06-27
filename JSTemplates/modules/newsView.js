(function ( $ ) {
	var $doc = $(document),
		$tmpl = [];
	
	$doc.ready( function () {
		var $view = $("#news-view");
		
		function hasTmpl() {
			var has = false;
			
			if( $tmpl.length > 0 ) {
				has = true;
			} else {
				console.log( "No template found, unable to process data." );
			}
		};
		
		// Handle a rewrite of the news view
		$doc.on( "activeNewsData", function ( e, tmpl, data ) {
			$tmpl = $(tmpl);
			if( hasTmpl ) {
				$view.empty()
					.html( $tmpl.applyTemplate( data ) );
			}
		});
		
		// Handle events where the view receives newer entries 
		$doc.on( "newNewsData", function ( e, data ) {
			if( hasTmpl ) {
				$view.prepend( $tmpl.applyTemplate( data ) );
			}
		});
		
		// Handle event identifying more data for the view, append this data
		$doc.on( "moreNewsData", function ( e, data ) {
			if( hasTmpl ) {
				$view.append( $tmpl.applyTemplate( data ) );
			}
		});
	});
})(jQuery);
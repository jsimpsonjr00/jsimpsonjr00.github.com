(function ( $ ) {
	var $doc = $(document);
	
	$doc.ready( function () {
		var $view 		= $("#ebay-thumb-view"),
			$thumbTmpl	= $("#theme-thumb-tmpl"),
			$itemTmpl 	= $("#item-thumb-tmpl"),
			nThemes		= 0; //number of themes added to the view
		
		function renderData( e, data ) {
			$view.empty();
			$view.append( $itemTmpl.applyTemplate( data ) );
		};
		
		// Handle new data entering the view
		$doc.on( "newEbayData", renderData ); //function ( e, data, tmpl ) {
			//renderData( data );
		//});
		
		$view.on( "click", "[id$=-thumb]", function ( e ) {
			var $thumb = $(this);
			$doc.trigger( "activateDetail", [ this ] );
		});
	});
})(jQuery);
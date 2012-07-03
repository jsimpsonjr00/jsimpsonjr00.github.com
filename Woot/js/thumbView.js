(function ( $ ) {
	var $doc = $(document);
	
	$doc.ready( function () {
		var $view 		= $("#woot-thumb-view"),
			$thumbTmpl	= $("#theme-thumb-tmpl"),
			$itemTmpl 	= $("#item-thumb-tmpl"),
			nThemes		= 0; //number of themes added to the view
		
		function renderData( data ) {
			var $theme;
			
			for( var theme in data ) {
				$theme = $("#"+ theme + "-item-thumb");
				
				if( $theme.length === 0 ) { //Need to create an item thumb entry for this theme
					$theme = $thumbTmpl.applyTemplate( data[theme] );
					applyItemClass( $theme, ++nThemes );
					$view.append( $theme );
				} else {
					$theme.empty()
						.html( $itemTmpl.applyTemplate( data[theme].item ) );
				}
			}
		};
		
		function applyItemClass( $item, i ) {
	    	var n = i;
	    	
	    	for( var loop = 1; loop <= 6; loop++ ) {
	    		if( n != 0 && n % loop === 0) {
	    			$item.addClass( "_" + loop ); 
	    		}
	    	}
	    };
	    
		// Handle new data entering the view
		$doc.on( "newWootData", function ( e, data, tmpl ) {
			renderData( data );
		});
		
		$view.on( "click", "[id$=-thumb]", function ( e ) {
			var $thumb = $(this);
			$doc.trigger( "activateDetail", [ this ] );
		});
	});
})(jQuery);
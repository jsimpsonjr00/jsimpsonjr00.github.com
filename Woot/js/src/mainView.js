(function ( $ ) {
	var $doc = $(document);
	
	$doc.ready( function () {
		var $view 		= $("#woot-detail-view"),
			$active		= null,
			$thumbTmpl	= $("#theme-detail-tmpl"),
			$itemTmpl 	= $("#item-detail-tmpl");
		
		function renderData( data ) {
			var $theme;
			
			for( var theme in data ) {
				$theme = $("#"+ theme + "-item-detail");
				
				if( $theme.length === 0 ) { //Need to create an item thumb entry for this theme
					$theme = $thumbTmpl.applyTemplate( data[theme] );
					$view.append( $theme );
				} else {
					$theme.empty()
						.html( $itemTmpl.applyTemplate( data[theme].item ) );
				}
			}
		};
		
		// Handle new data entering the view
		$doc.on( "newWootData", function ( e, data ) {
			renderData( data );
		});
		
		// Handle events attempting to activate one of the details
		$doc.on( "activateDetail", function ( e, target ) {
			var $target = $(target);
			
			if( target !== undefined ) {
				$active ? $active.removeClass("active") : null;
				$active = $( "#"+ $target.attr("data-theme") + "-item-detail").addClass("active");
				$view.addClass("active");
			}
		});
		
		$view.on( "click", function ( e ) {
			//console.log( e.srcElement.tagName );
			$view.removeClass("active");
		});
		
		$view.on( "click", "a", function( e ) {
			e.stopPropagation();
		});
	});
})(jQuery);
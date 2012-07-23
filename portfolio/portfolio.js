(function ( $ ) {
	$(document).ready( function () {
	    var $portfolio  = $("#portfolio"),
	        $lightbox   = $("#lightbox");
	    
	    var $activeDetail = null;
	    
	    $portfolio.html( $("#project-thumb-tmpl").applyTemplate( portfolio.projects ) );
	    $lightbox.html(  $("#project-detail-tmpl").applyTemplate( portfolio.projects ) );
	    
	    $portfolio.on( "click", ".item", function ( e ) {
	    	var $item = $(this);
	    	
	    	$activeDetail = $( "#" + $item.attr("data-id") + "-detail" );
	    	$activeDetail.addClass( "active" );
	    	$lightbox.addClass( "active" );
	        //$(this).find(".lightbox").addClass( "active" );	
	    });
	    
	    $lightbox.on( "click", "", function ( e ) {
	        $lightbox.removeClass("active");
	    	$activeDetail.removeClass("active");
	    	e.stopPropagation();
	    });
	});
})( jQuery );
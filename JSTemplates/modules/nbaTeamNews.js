( function( $ ) {
	var $doc = $(document);
	
	var config = {
		tmpl:	"#nba-team-news-tmpl"
	};
	
	function nbaActive( e, opts ) {
		$.ajax( {
        	type:      "GET",
        	dataType:  "jsonp",
        	url:       "http://pipes.yahoo.com/pipes/pipe.run",
        	jsonp:     "_callback",
        	data:  {
        		"_id":        "607a01c98a06bd88d3d60a002f33b9b0",
        		"_render":    "json",
        		team:         opts.nba.team
        	},
        	timeout:   (10 * 1000),
        	success: function ( data, xhr, status ) {
        		$doc.trigger( "activeNewsData", [ config.tmpl, data.value.items ] );
        	},
        	error: function ( xhr, status, error ) {
        		console.log( status );
        	}
        });
	};
	
	$(document).on( "nbaActive", nbaActive );
})( jQuery );
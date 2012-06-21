( function( $ ) {
	
	function nbaActive( e, team ) {
		$.ajax( {
        	type:      "GET",
        	dataType:  "jsonp",
        	url:       "http://pipes.yahoo.com/pipes/pipe.run",
        	jsonp:     "_callback",
        	data:  {
        		"_id":        "607a01c98a06bd88d3d60a002f33b9b0",
        		"_render":    "json",
        		team:         team
        	},
        	timeout:   20,
        	success: function ( data, xhr, status ) {
        		var $teamNews = $("#nba-team-news");
        		var $tmpl = $("#nba-team-news-tmpl");
        		$teamNews.html( $tmpl.applyTemplate( data.value.items ) );
        	},
        	error: function ( xhr, status, error ) {
        		console.log( status );
        	}
        });
	};
	
	$(document).on( "nbaActive", nbaActive );
})( jQuery );
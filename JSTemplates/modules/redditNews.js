( function( $ ) {
	var $doc = $(document),
		config = {
			tmpl:	"#reddit-news-tmpl"
		};
	
	function redditActive( e, opts ) {
		$.ajax( {
        	type:      	"GET",
        	dataType:  	"jsonp",
        	url:       	"http://www.reddit.com/r/" + opts.reddit.subreddit + "/.json",
        	jsonp:		"jsonp",
        	timeout:   (10 * 1000),
        	success: function ( data, xhr, status ) {
        		$doc.trigger( "activeNewsData", [ config.tmpl, data.data.children ] );
        	},
        	error: function ( xhr, status, error ) {
        		console.log( status );
        	}
        });
	};
	
	$doc.on( "redditActive", redditActive );
})( jQuery );
( function ( $ ) {
var $doc = $(document);
	
	$doc.ready( function () {
		var $time		= $("#woot-status-time"),
			refreshTime	= 0,
			timeoutID	= null;
		
		// Handle new data entering the view
		$doc.on( "autoRefreshScheduled", function ( e, milliseconds ) {
			refreshTime = milliseconds/1000;
			setRefreshTime();
		});
		
		function setTimeout( ) { //initate a routine to update this status count
			var interval = 5; //update every 5 seconds
			window.clearTimeout( timeoutID );
			timeoutID = window.setTimeout( setRefreshTime, interval * 1000 );
			refreshTime -= interval;
		};
		
		function setRefreshTime( ) {
			var min 	= Math.floor( refreshTime/60 ),
				sec		= refreshTime % 60,
				status 	= "";
			
			if( refreshTime > 0 ) {
				status = min + ":" + (sec < 10 ? "0" + sec : sec );
			} else {
				status = "Now";
			}
			
			$time.html( status );
			setTimeout();
		};
	});
})( jQuery );
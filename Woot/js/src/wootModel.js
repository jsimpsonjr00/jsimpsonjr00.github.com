( function ( $ ) {
	var $doc = $(document),
		autoRefreshTimeout = null,
		config = {
			tmpl: "#woot-detail-tmpl"
		},
		activeCache 	= {},
		oldCache 		= {},
		wootOffActive 	= false,
		//Default AJAX options object
		defaultOpts = {
	        type:       "GET",
	        dataType:   "jsonp",
	        url:        "http://pipes.yahoo.com/pipes/pipe.run", //"http://api.woot.com/1/sales/current.jsonp",
	        jsonp:		"_callback",
        	data:  {
        		"_id":        "22de465a94e4410f27763dfbfe4d82e1",
        		"_render":    "json"
        	},
	        success: function ( data, xhr, status ) {
	        	//fire events to update views
	        	$doc.trigger( "newWootData", [ processData(data) ] );
	        },
	        error: function (xhr, status, error) {
	            autoRefresh( true );
	        },
	        timeout: (10 * 1000)
	    };
    
    //remove model event handlers
    function beforeActive( e ) {
    	$doc.off( "modelNew modelMore");
    };
    
    function wootActive( e ) {
    	$doc.off( "modelNew"); //remove previous model event handlers
    	$doc.on( "modelNew", modelNew ); //setup event handlers for this newly activated model
    	
    	$.ajax( defaultOpts );
    };
    
    function processData( data, event ) { //process data into the appropriate cache
    	var items 	= data.value.items,
    		item	= {},
    		updates	= {},
    		wootOff	= false;
    	
    	for( var i = 0; i < items.length; i++ ) {
    		item = items[i];
    		
    		// new item or updated item
    		if( activeCache[item.ThemeName] === undefined || activeCache[item.ThemeName].SaleUrl !== item.SaleUrl || activeCache[item.ThemeName].SoldOutPercentage !== item.SoldOutPercentage) {
    			if( item.SoldOutPercentage <= 1 ) { //handle two different formats the feed may contain
    				item.PercentAvailable = 100 - (item.SoldOutPercentage * 100);
    			} else {
    				item.PercentAvailable = 100 - item.SoldOutPercentage;
    			}
    			
    			item.WootOff ? wootOff = true : null;
    			
    			item = { 
    				"ThemeName": item.ThemeName,
					"item": item
    			};
    			updates[item.ThemeName] 	= item;
    			activeCache[item.ThemeName] 	= item;
    		} //else this is a duplicate in cache not to be worried about
    	}
    	
    	wootOffActive = wootOff;	//set wootOffStatus based on most recent data
    	autoRefresh( ); 			//setup auto refreshing
    	return updates;
    };
    
    function autoRefresh( error ) {
    	var tenMin 	= 10 * 60 * 1000,
    		oneMin	= 1 * 60 * 1000,
    		errTime	= 30 * 1000,
    		autoRefreshTime = errTime; //default to 30 sec for errors, set to 1 min if wootOff, otherwise 10 mins
    	
    	if( error !== true ) {
    		autoRefreshTime = wootOffActive ? oneMin : tenMin; //set to 1 min if wootOff, otherwise 10 mins
    	}
    	
    	window.clearTimeout( autoRefreshTimeout );		//clear any prexisting timeout in case of manual refresh
    	autoRefreshTimeout = window.setTimeout(
    		function () {
    			$doc.trigger( "modelNew", [] );
			}, 
			autoRefreshTime
		);
    	
    	$doc.trigger( "autoRefreshScheduled", [autoRefreshTime] );
    };
    
    function modelNew( e ) { //do a request which gets new woots
    	var newOpts = {
    		success: function ( data, xhr, status ) {
    			$doc.trigger( "newWootData", [ processData(data) ] );
            }
    	};
    	
    	newOpts = $.extend( true, defaultOpts, newOpts );
    	$.ajax( newOpts );
    };
    
//Commands to execute on load  
    $doc.on("wootActive", wootActive );
})(jQuery);
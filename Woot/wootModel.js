( function ( $ ) {
	var $doc = $(document),
		autoRefreshTimeout = null,
		config = {
			tmpl: "#woot-detail-tmpl"
		},
		activeCache = {},
		oldCache = {},
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
	            //$tmln.html( "<h2>Unable to connect with Twitter.</h2>");
	        },
	        timeout: (10 * 1000)
	    };
    
    //remove model event handlers
    function beforeActive( e ) {
    	$doc.off( "modelNew modelMore");
    };
    
    function wootActive( e ) {
    	$.ajax( defaultOpts );
    	
    	//remove previous model event handlers - hmm, which method should I use?
    	$doc.off( "modelNew");
    	//$doc.trigger( "beforeActive" );
    	
    	//setup event handlers for this newly activated model
    	$doc.on( "modelNew", modelNew );
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
    			item.PercentAvailable = 100 - (item.SoldOutPercentage * 100);
    			item.WootOff == true ? wootOff = true : null;
    			
    			item = { 
    				"ThemeName": item.ThemeName,
					"item": item
    			};
    			updates[item.ThemeName] 	= item;
    			activeCache[item.ThemeName] 	= item;
    		} //else this is a duplicate in cache not to be worried about
    	}
    	
    	
    	autoRefresh( wootOff ); //setup auto refreshing
    	return updates;
    };
    
    function autoRefresh( wootOff ) {
    	var tenMin 	= 10 * 60 * 1000,
    		oneMin	= 1 * 60 * 1000,
    		autoRefreshTime = wootOff ? oneMin : tenMin; //set to 1 min if wootOff, otherwise 10 mins
    	
    	window.clearTimeout( autoRefreshTimeout );		//clear any prexisting timeout in case of manual refresh
    	autoRefreshTimeout = window.setTimeout(function () {
    		$doc.trigger( "modelNew", [] );
		}, 
		autoRefreshTime );
    };
    
    function modelNew( e ) { //do a request which gets new woots
    	var newOpts = {
    		success: function ( data, xhr, status ) {
    			$doc.trigger( "newWootData", [ processData(data) ] );
            },
            error: function (xhr, status, error) {
                //$tmln.html( "<h2>Unable to connect with Twitter.</h2>");
            }
    	};
    	
    	newOpts = $.extend( true, defaultOpts, newOpts );
    	$.ajax( newOpts );
    };
    
//Commands to execute on load  
    $doc.on("wootActive", wootActive );
})(jQuery);
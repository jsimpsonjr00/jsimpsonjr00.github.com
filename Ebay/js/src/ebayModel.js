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
	        url:        "http://deals.ebay.com/feeds/jsonp",
	        jsonp:		"callbackname",
        	data:  {
        		
        	},
	        success: function ( data, xhr, status ) {
	        	//fire events to update views
	        	$doc.trigger( "newEbayData", [ processData(data) ] );
	        },
	        error: function (xhr, status, error) {
	            //autoRefresh( true );
	        },
	        timeout: (10 * 1000)
	    };
    
	function ebayDataArrived( e, data ) {
		$doc.trigger( "newEbayData", [ processData( data ) ] );
	}
    //remove model event handlers
	function beforeActive( e ) {
    	$doc.off( "modelNew modelMore");
    };
    
    function ebayActive( e ) {
    	$doc.off( "modelNew"); //remove previous model event handlers
    	$doc.on( "modelNew", modelNew ); //setup event handlers for this newly activated model
    	
    	$.ajax( defaultOpts );
    };
    
    function processData( data, event ) { //process data into the appropriate cache
    	var items 	= data.ebaydailydeals.items,
    		item	= {},
    		updates	= {},
    		wootOff	= false;
    	
    	for( var i = 0; i < items.length; i++ ) {
    		//item = items[i];
    		items[i].PercentAvailable = Math.floor( (items[i].quantity - items[i].quantitysold) / items[i].quantity * 100);
    	}
    /*		
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
    	
    	wootOffActive = wootOff;	//set wootOffStatus based on most recent data
    	autoRefresh( ); 			//setup auto refreshing*/
    	return items;
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
    			$doc.trigger( "newEbayData", [ processData(data) ] );
            }
    	};
    	
    	newOpts = $.extend( true, defaultOpts, newOpts );
    	$.ajax( newOpts );
    };
    
//Commands to execute on load  
    $doc.on("ebayActive", ebayActive );
    $doc.on( "ebayDataArrived", ebayDataArrived );
})(jQuery);
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
})(jQuery);(function ( $ ) {
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
})(jQuery);( function ( $ ) {
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
})(jQuery);( function ( $ ) {
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
			var interval = 1; //update every 5 seconds
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
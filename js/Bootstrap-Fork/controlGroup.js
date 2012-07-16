(function ( $ ) {
	var Bootstrap = {};
	//Add a TwitterBootstrap namespace to the jQuery object if needed and reference locally as simply Bootstrap
	if( $.TwitterBootstrap == undefined ) {
		$.TwitterBootstrap = Bootstrap;
	} 
	else {
		Bootstrap = $.TwitterBootstrap;
	}
	Bootstrap.support = {};
	Bootstrap.support.transition = function () {
		var thisBody = document.body || document.documentElement
        , thisStyle = thisBody.style
        , support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined
        
        if( support ) {
        	return true;
        } 
        else {
        	return false;
        }
	}();
	Bootstrap.SingleSelectGroup = function ( $group, childSelector, firstActive, parentLock ) {
		this.$active 		= null;
		this.bLocked 		= false;
		this.parentLocked	= parentLock ? parentLock : false; //option that requires the parent to clear transition input locks
		
		//setup event handlers
		$group.on( "click.singleSelectGroup", childSelector, { self: this }, this.activate ); 	//handle childSelector clicks
		$group.on( "deactivate.singleSelectGroup", { self: this }, this.deactivate ); 			//custom event to deactivate
		$group.on( "webkitTransitionEnd transitionend oTransitionEnd", { self: this }, this.transitionEnd );
		
		if( firstActive ) {
			$group.find( childSelector ).first().trigger("click", []);
		}
	}
	Bootstrap.SingleSelectGroup.prototype = {
		constructor: Bootstrap.SingleSelectGroup,
		deactivate: function ( e ) {
			var self = e.data.self;
			
			if( self.isValid() ) {
				if( self.$active ) {
					self.$active.addClass("deactivate")				//execute a deactivate transition
						.removeClass("active")
						.trigger("hidden", [self.$active]);
				
					self.supportTransition(); //support old browsers
					self.$active = null;
				}
			}
		},
		activate: function ( e ) {
			var $selected = $( e.target ),
				self = e.data.self;
			
			if( self.isValid( $selected ) ) {
				self.deactivate( e );
				
				if( $selected ) {
					self.$active = $selected;
					self.$active.addClass("active")
						.trigger("shown", [self.$active]);

					self.lock();
					self.supportTransition(); //support old browsers
				}
			}
			else {
				e.stopImmediatePropagation();
			}
		},
		supportTransition: function () { //Support old browsers by manually triggering a transition end event, if needed
			if( !Bootstrap.support.transition && this.$active ) {
				this.$active.trigger( "transitionend", [] );
			}
		},
		isValid: function ( $selected ) { //Determines if a requested action is valid to execute
			var ready = !this.bLocked; //inverse logic requires !
			
			if( $selected && this.$active && ($selected["0"] == this.$active["0"]) ) { //if optional $selected is $active, return false 
				ready = false;
			}
			
			return ready;
		},
		lock: function () { //only allow locks if transitions are supported
			Bootstrap.support.transition ? this.bLocked = true : null;
		},
		unlock: function () {
			this.bLocked = false;
		},
		transitionEnd: function ( e ) {
			var self = (this instanceof Bootstrap.SingleSelectGroup) ? this : e.data.self,
				$target = $(e.target);
			if( !self.parentLocked ) { //only unlock if the parent hasn't taken that responsibility
				self.unlock();
			}
			$target.removeClass("deactivate");
		}
	};
	$.fn.singleSelectGroup = function( childSelector, firstActive, parentLock ) {
		var group;
		this.each( function () {
			group = new Bootstrap.SingleSelectGroup( $(this), childSelector, firstActive, parentLock );
		});
		
		return { $element: this, group: group };
	};
	
	Bootstrap.TabView = function ( element ) {
		var $this	= $(element),
			$tabs 	= $this.find(".control-group"),
			$panes 	= $this.find(".pane-group");
		
		
		this.tabGroup = $tabs.singleSelectGroup( "button", true, true ).group;
		this.paneGroup = $panes.singleSelectGroup( ".pane", true, false ).group;
		
		$panes.on( "transitionend webkitTransitionEnd oTransitionEnd", ".pane", { self: this }, this.transitionEnd );
		$tabs.on( "click.tabView", "button", { self: this }, this.click ); //capture button clicks
		/*var tabs  = $this.find(".control-group").singleSelectGroup( "button", true, true ),
			panes = $this.find(".pane-group").singleSelectGroup( ".pane", true, false );
		
		tabs.$element.on( "click.tabView", "button", { self: this }, this.click ); //capture button clicks
		panes.$element.on( "transitionend webkitTransitionEnd oTransitionEnd", ".pane", { self: this }, this.transitionEnd );
		panes.$element.on( "tEnd", {self: this }, this.transitionEnd );
		this.tabGroup  = tabs.group;
		*/
	}
	Bootstrap.TabView.prototype = {
		constructor: Bootstrap.TabView,
		tabGroup: null,
		click: function ( e ) {
			var $button = $(e.target);
			$( $button.attr("data-pane") ).trigger("click", []);
			e.data.self.lock();
		},
		lock: function () {
			this.tabGroup ? this.tabGroup.lock() : null;
		},
		unlock: function () {
			this.tabGroup.unlock();
			this.paneGroup ? this.paneGroup.unlock() : null;
		},
		transitionEnd: function ( e ) {
			if( $(e.target).hasClass("pane") ) {
				e.data.self.unlock();
			}
		}
	};
	$.fn.tabView = function () {
		return this.each( function () { //return for chaining
			var view = new Bootstrap.TabView( this );
		});
	};
	
	Bootstrap.CarouselView = function ( element, opts ) {
		var $this 	= $(element),
			$navs  	= $this.find(".control-group"),
			panes 	= $this.find(".pane-group").singleSelectGroup( ".pane", true );
		
		this.opts		= opts;
		this.$items 	= panes.$element.find(".pane");
		this.$inner		= $this.find(".inner");
		this.panesGroup	= panes.group;
		
		this.bLocked 	= false;				//flag used to lockout transitions
		
		this.transitionClass = {
			vertical: {
				next: "transition-slide-up",
				prev: "transition-slide-down"
			},
			horizontal: {
				next: "transition-slide-left",
				prev: "transition-slide-right"
			}
		};
		
		if( this.$items.length > 0 ) {
			this.nCurrent = 0;
		}
		$navs.find(".nav-next").on("click.carouselView",  {self: this}, this.next );
		$navs.find(".nav-prev").on("click.carouselView",  {self: this}, this.prev );
		
		$this.on( "webkitTransitionEnd transitionend oTransitionEnd", {self: this }, this.transitionEnd );
		
		return this;
	};
	Bootstrap.CarouselView.prototype = {
		constructor: Bootstrap.Carousel,
		$items: null,
		nCurrent: null,
		next: function ( e ) {
			var self = e.data.self;
			
			if( self.isValid() ) {
				self.nCurrent++;
			
				if( self.nCurrent == self.$items.length) { //nav past the end, start over
					self.nCurrent = 0;
				}
				
				self.$inner.addClass( self.transitionClass[self.opts.transition].next ).removeClass( self.transitionClass[self.opts.transition].prev );
				self.activate();
			}
		},
		prev: function ( e ) {
			var self = e.data.self;
			
			if( self.isValid() ) {
				self.nCurrent--;
				
				if( self.nCurrent < 0) { //nav past the end, start over
					self.nCurrent = self.$items.length - 1;
				}
				
				self.$inner.addClass( self.transitionClass.prev ).removeClass( self.transitionClass.next );
				self.activate();
			}
		},
		transitionEnd: function ( e ) {
			e.data.self.unlock();
		},
		isValid: function () {
			return !this.bLocked;
		},
		lock: function () {
			this.bLocked = true;
		},
		unlock: function () {
			this.bLocked = false;
		},
		activate: function () {
			var $pane = $(this.$items[this.nCurrent]);
			
			this.lock();				//lockout further activations until current ends
			$pane.offset();  			//force reflow so that the left position is correct
			$pane.trigger("click", []);	
		}
	};
	$.fn.carouselView = function ( opts ) {
		return this.each( function () { //return for chaining
			var carousel = new Bootstrap.CarouselView( this, opts );
		});
	};
}(jQuery));
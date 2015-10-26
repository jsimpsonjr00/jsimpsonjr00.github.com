( function ( $ ) {
    // requestAnim shim layer by Paul Irish
    function fallback(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              fallback
    })();
    
    function Clock( ) {
        
    }
    Clock.prototype = {
        tX: new Date().getTime(), //start time
        restart: function ( ) {
            this.tX =  new Date( ).getTime( );
        },
        elapsed: function ( ) {
            return new Date().getTime() - this.tX; //elapsed milliseconds since clock started
        }
    };
    var Raindrop2D = {
        position: {
            x: -20,
            y: -40,
        },
        velocity: { //in pixels per frame
            x: 0,
            y: 5,
            z: 0
        },
        size: {
            x: 20,
            y: 20,
            z: 0
        }        
    };
    function Raindrop ( ctx ) {
        this.ctx = ctx;
        $.extend( true, this, Raindrop2D );
        this.randomizeSize( );
    }
    Raindrop.prototype = {
        fillStyle: "rgba(0, 0, 255, 0.5)",
        ctx: null,
        animDuration: 1000, //in milliseconds
        drop: function ( x, y ) {
            this.position.x = x;
            this.position.y = y;            
            this.randomizeSize( );
        },
        randomizeSize: function ( ) {
            this.size.x = Math.floor( Math.random( ) * 5 + 5 ) * 2;
            this.size.y = this.size.x;
        },
        move: function ( ) {
            this.position.y += this.velocity.y;
        },
        render: function ( ) {
            if( this.inBounds() ) {
                this.move( );
                
                this.ctx.fillStyle = this.fillStyle;
                this.ctx.beginPath();
                this.ctx.arc( this.position.x, this.position.y, this.size.x/2, 0, Math.PI * 1, false );
                this.ctx.lineTo( this.position.x, this.position.y-this.size.y );
                this.ctx.lineTo( this.position.x + this.size.x/2, this.position.y );
                this.ctx.fill();
            }
        },
        inBounds: function () {
            return ( this.position.y <= (this.ctx.canvas.height + 40) );   
        }
    };
    $(document).ready( function () {
       var canvas = document.getElementById('canvaser'),
       		$body = $( "body" );
       
       if (canvas.getContext) {
           var ctx = canvas.getContext('2d'),
               drops = [];//new Raindrop( canvas, ctx );
           
           function animate() {
               requestAnimFrame( animate );
               drawFrame( );
           }
           
           function drawFrame( ) {
               ctx.clearRect ( 0,0, canvas.width, canvas.height );
               
               for( var i = 0; i < drops.length; i++ ) {
                   var drop = drops[i];
                   if( drop.inBounds() ) {
                        drop.render( );   
                   } else {
                        randomizeDrop( drop );
                   }
               }
               ctx.fillText("Refreshing...", canvas.width/2 - 8, canvas.height/2 + 8);
           }
           function randomizeDrop( drop ) {
               //randomize drop location
               drop.drop( Math.floor( Math.random() * ( canvas.width + 10 )),
                          Math.floor( Math.random() * -600 ) - 40 );
           }
           function addDrop( i ) {
               var drop = new Raindrop( ctx );
               randomizeDrop( drop );
               drops.push( drop );
               i++;
               if( i < 25 ) {
                   addDrop( i );
               }
           }
           function fitToWindow( ) {
               ctx.canvas.width  = $body.innerWidth( );
               ctx.canvas.height = $body.innerHeight( );
           };
           $(window).on( "resize", function ( ) {
               fitToWindow( );
           } );
           
           fitToWindow( );
           ctx.font = "16px Arial";
           addDrop( 0 );
           animate();
       } 
    });
}) ( jQuery );
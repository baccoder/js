function setCookie( cname, cvalue, exdays ) {
    var d = new Date();
    d.setTime( d.getTime() + (exdays * 24 * 60 * 60 * 1000) );
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie( cname ) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent( document.cookie );
    var ca = decodedCookie.split( ';' );
    for ( var i = 0; i < ca.length; i++ ) {
        var c = ca[ i ];
        while ( c.charAt( 0 ) == ' ' ) {
            c = c.substring( 1 );
        }
        if ( c.indexOf( name ) == 0 ) {
            return c.substring( name.length, c.length );
        }
    }
    return false;
}

/*=================================================*/
//                    WISHLIST                     //
/*=================================================*/
function FeaturedList( config ) {

    //================================
    // Config
    // ===============================
    if( ! config ) throw new Error('Config mismatched');

    this.config = config;
    this.featured = getCookie( config.cookieKey ) ? getCookie( config.cookieKey ).split( config.separator ) : [];

    var __self = this;

    //======================================
    // Add active class for saved elements
    // =====================================
    if ( this.featured ) {
        for ( var i = 0; i < this.featured.length; i++ ) {
            try {
                var btnSelector = config.targetSelector + '[data-'+ config.dataAttr +'="' + this.featured[ i ] + '"]';
                document.querySelector( btnSelector ).classList.add( config.activeClassName );
            } catch ( e ) {
            }
        }
    }

    //======================================
    // Listen clicks
    // =====================================
    var targets = document.querySelectorAll( config.targetSelector );
    targets.forEach( function( target ){
        target.addEventListener('click', function ( e ){
            if ( this.className.indexOf( config.activeClassName ) === -1 ) {
                this.classList.add( config.activeClassName );
                __self.set( this.dataset.id );
            }
            else {
                this.classList.remove( config.activeClassName );
                __self.remove( this.dataset.id );
            }
        } );
    });

    //======================================
    // Add active class for saved elements
    //======================================
    this.featured.forEach( function( productID ){
        var selector = config.targetSelector + '[data-'+ config.dataAttr +'="'+ productID +'"]';
        var target = document.querySelector( selector );
        target && target.classList.add( config.activeClassName );
    });
}

// Methods
FeaturedList.prototype.set = function ( featuredID ) {
    var itemIndex = this.featured.indexOf( featuredID );
    if ( itemIndex === -1 ) {
        this.featured.push( featuredID );

        //Set limit, if more than maxLength remove most older postID
        if ( this.featured.length > this.config.maxLength ) {
            this.featured.shift();
        }
    }
    setCookie( this.config.cookieKey, this.featured.join( this.config.separator ) );
}

FeaturedList.prototype.remove = function ( featuredID ) {
    var itemIndex = this.featured.indexOf( featuredID );
    this.featured.splice( itemIndex, 1 );
    setCookie( this.config.cookieKey, this.featured.join( this.config.separator ) );
}

/**
 * Prodo v1.1
 * Onepage HTML template
 * http://axminenko.com
 *
 * Copyright 2014 Alexander Axminenko
 */
"use strict";

/* Default Variables */
var ProdoOptions = {
    parallax: true,
    loader: true,
    animations: true,
    scrollSpeed: 700,
    navigation: 'sticky',
    intro: {
        animate: true,
        animateDelayFirst: 500,
        animateDelay: 300
    }
}

if ( typeof Prodo !== 'undefined' ) {
    $.extend( ProdoOptions, Prodo );
}

var ProdoTheme = {
    // Initialize
    init: function( ) {
        ProdoTheme.intro( );
        ProdoTheme.navigation( );
        ProdoTheme.portfolio( );
        ProdoTheme.shortcodes( );
        ProdoTheme.animations( );
        ProdoTheme.loader( );

        ProdoTheme.contact( );
        ProdoTheme.map( );

        ProdoTheme.tweaks( );
        ProdoTheme.parallax( );
        ProdoTheme.videos( );
        ProdoTheme.imageSlider( );
        ProdoTheme.contentSlider( );
        ProdoTheme.blog( );

        ProdoTheme.twitter( );
    },

    // Page Loader
    loader: function( ) {
        if ( ProdoOptions.loader ) {
            var loaderHide = function( ) {
                $( window ).trigger( 'prodo.loaded' );
                $( '.page-loader .content' ).delay( 500 ).fadeOut( );
                $( '.page-loader' ).delay( 1000 ).fadeOut( 'slow', function( ) {
                    $( window ).trigger( 'prodo.complete' );
                } );
            };

            // Loadsafe
            $( window ).load( function( ) {
                window._loaded = true;
            } );
            window.loadsafe = function( callback ) {
                if ( window._loaded ) {
                    callback.call( );
                } else {
                    $( window ).load( function( ) {
                        callback.call( );
                    } );
                }
            }

            // Hidding
            if ( $( '#intro' ).attr( 'data-type' ) == 'video' && ! Modernizr.touch ) {
                $( window ).on( 'prodo.intro-video', function( ) {
                    window.loadsafe( function( ) {
                        loaderHide( );
                    } );
                } );
            } else {
                $( window ).load( function( ) {
                    loaderHide( );
                } );
            }
        } else {
            $( document ).ready( function( ) {
                $( window ).trigger( 'prodo.loaded' );
                $( '.page-loader' ).remove( );
                $( window ).trigger( 'prodo.complete' );
            } );
            $( window ).load( function( ) {
                $( window ).trigger( 'prodo.complete' );
            } );
        }
    },

    // Navigation
    navigation: function( ) {
        // Floating Menu
        var floatingMenuShow = function( ) {
            var $that = $( '.navbar.floating' ), $old = $( '.navbar:not(.floating)' );
            if ( ! $that.hasClass( 'process' ) ) {
                dropdownHide( );
                $old.animate( { opacity: 0 }, { duration: 75, queue: false, complete: function( ) {
                    $that.find( 'img[data-alt]' ).each( function( ) {
                        $( this ).attr( 'src', $( this ).attr( 'data-alt' ) ).removeAttr( 'data-alt' );
                        new RetinaImage( this );
                    } );
                } } );
                $that.addClass( 'process' ).addClass( 'positive' );
                setTimeout( function( ) {
                    $that.removeClass( 'process' );
                }, 200 );
            }
        };
        var floatingMenuHide = function( ) {
            var $that = $( '.navbar.floating' ), $old = $( '.navbar:not(.floating)' );
            if ( ! $that.hasClass( 'process' ) ) {
                dropdownHide( );
                $that.addClass( 'process' ).removeClass( 'positive' ).addClass( 'negative' );
                $old.animate( { opacity: 1 }, { duration: 250, queue: false } );
                $old.find( '.navbar-collapse.collapse.in' ).removeClass( 'in' );
                setTimeout( function( ) {
                    $that.removeClass( 'negative' ).removeClass( 'process' );
                }, 200 );
            }
        };
        var floatingMenu = function( ) {
            var isFloating = $( '.navbar' ).hasClass( 'positive' );
            if ( $( document ).scrollTop( ) > 0 && ! isFloating ) {
                floatingMenuShow( );
            } else if ( $( document ).scrollTop( ) == 0 && isFloating ) {
                floatingMenuHide( );
            }
        };

        // Dropdown Menu
        var dropdownHide = function( ) {
            if ( $( '.navbar .dropdown.open' ).length == 0 ) return;
            $( '.navbar .dropdown.open' ).each( function( ) {
                $( this ).find( '.dropdown-menu' ).animate( { opacity: 0 }, { duration: 150, queue: false, complete: function( ) {
                    $( this ).parent( ).removeClass( 'open' );
                } } );
            } );
        };
        var dropdownShow = function( $that ) {
            $that.find( '.dropdown-menu' ).css( { opacity: 0 } );
            $that.addClass( 'open' ).find( '.dropdown-menu' ).animate( { opacity: 1 }, { duration: 150, queue: false } );
        };

        // Collapse Menu
        var collapseMenu = function( ) {
            if ( $( '.navbar-collapse.collapse.in' ).length > 0 ) {
                $( '.navbar-collapse.collapse.in' ).each( function( ) {
                    $( this ).parent( ).find( '.navbar-toggle' ).click( );
                } );
            }
        };

        $( window ).resize( function( ) {
            collapseMenu( );
            dropdownHide( );
        } ).scroll( function( ) {
            collapseMenu( );
        } );

        // Navbar Toggle
        $( '.navbar .navbar-toggle' ).click( function( evt ) {
            evt.preventDefault( );
            dropdownHide( );
        } );

        // Create floating navigation bar
        if ( $( '#intro' ).length > 0 && ProdoOptions.navigation == 'sticky' ) {
            $( '.navbar' ).clone( ).prependTo( 'body' ).addClass( 'floating navbar-fixed-top' ).find( '.navbar-toggle' ).attr( 'data-target', '#navbar-collapse-alt' ).parent( ).parent( ).find( '.navbar-collapse' ).attr( 'id', 'navbar-collapse-alt' );

            $( window ).load( function( ) {
                floatingMenu( );
            } ).scroll( function( ) {
                floatingMenu( );
            } );
        }
        if ( $( '#intro' ).length == 0 && ProdoOptions.navigation != 'sticky' ) {
            $( '.navbar' ).removeClass( 'navbar-fixed-top' ).css( { position: 'absolute' } );
        }

        // Dropdown Menu
        var dropdownTimer;
        $( '.dropdown' ).hover( function( ) {
            if ( ! $( this ).parent( ).parent( ).hasClass( 'in' ) && ! $( this ).parent( ).parent( ).hasClass( 'collapsing' ) ) {
                clearTimeout( dropdownTimer );
                if ( $( this ).hasClass( 'open' ) ) return;
                dropdownShow( $( this ) );
            }
        }, function( ) {
            if ( ! $( this ).parent( ).parent( ).hasClass( 'in' ) ) {
                dropdownTimer = setTimeout( function( ) {
                    dropdownHide( );
                }, 500 );
            }
        } );
        $( document ).on( 'click', '.navbar-collapse.in .dropdown > a', function( evt ) {
            evt.preventDefault( );
            var $parent = $( this ).parent( );
            if ( ! $parent.hasClass( 'open' ) ) {
                dropdownShow( $parent );
            } else {
                dropdownHide( );
            }
        } );

        // Scroll to Anchor Links
        $( 'a[href^=#]' ).click( function( evt ) {
            if ( $( this ).attr( 'href' ) != '#' && ! $( evt.target ).parent( ).parent( ).is( '.navbar-nav' ) && ! $( this ).attr( 'data-toggle' ) ) {
                $( document ).scrollTo( $( this ).attr( 'href' ), ProdoOptions.scrollSpeed, { offset: { top: -85, left: 0 } } );
                evt.preventDefault( );
            }
        } );

        // Navigation
        $( document ).ready( function( ) {
            $( '.navbar-nav' ).onePageNav( {
                currentClass: 'active',
                changeHash: false,
                scrollSpeed: ProdoOptions.scrollSpeed,
                scrollOffset: 85,
                scrollThreshold: 0.5,
                filter: 'li a[href^=#]',
                begin: function( ) {
                    collapseMenu( );
                }
            } );
        } );

        if ( document.location.hash && ProdoOptions.loader ) {
            if ( ! /\?/.test( document.location.hash ) ) {
                $( window ).load( function( ) {
                    $( window ).scrollTo( document.location.hash, 0, { offset: { top: -85, left: 0 } } );
                } );
            }
        }

        // To Top
        $( '.footer .to-top' ).click( function( ) {
            $( window ).scrollTo( $( 'body' ), 1500, { offset: { top: 0, left: 0 } } );
        } );
    },

    // Intro
    intro: function( ) {
        if ( $( '#intro' ).length == 0 ) {
            return;
        }

        var $that = $( '#intro' );
        var useImages = false, useVideo = false;

        // Vertical Align Content
        var verticalAlignContent = function( ) {
            var contentH = $that.find( '.content' ).outerHeight( ), windowH = $( window ).height( ), menuH = $that.find( '.navbar' ).outerHeight( true ),
                value = ( windowH / 2 ) - ( contentH / 2 ) - menuH / 2;
            $that.find( '.content' ).css( { marginTop: Math.floor( value ) } );
        };

        // Magic Mouse
        var magicMouse = function( ) {
            var mouseOpacity = 1 - $( document ).scrollTop( ) / 400;
            if ( mouseOpacity < 0 ) mouseOpacity = 0;
            $that.find( '.mouse' ).css( { opacity: mouseOpacity } );
        };

        if ( ! ProdoOptions.intro.animate ) {
            $that.find( '.animate' ).removeClass( 'animate' );
        }

        $( window ).resize( function( ) {
            verticalAlignContent( );
        } );
        $( window ).load( function( ) {
            verticalAlignContent( );
            magicMouse( );
        } );
        $( window ).scroll( function( ) {
            magicMouse( );
        } );

        // Static Image or Pattern
        if ( $that.attr( 'data-type' ) == 'static-image' || $that.attr( 'data-type' ) == 'image-pattern' ) {
            useImages = true;

            var $elements = $that.find( '.animate' );
            if ( $elements.length > 0 ) {
                verticalAlignContent( );

                $( window ).on( 'prodo.complete', function( ) {
                    $( $elements ).each( function( i ) {
                        var $this = $( this );
                        setTimeout( function( ) {
                            $this.addClass( 'complete' );
                        }, 0 + ( i * ProdoOptions.intro.animateDelay ) );
                    } );
                } );
            } else {
                verticalAlignContent( );
            }

            $( '<div />' ).addClass( 'slider fullscreen' ).prependTo( 'body' );
            $( '<div />' ).addClass( 'image' ).css( {
                opacity: 0,
                backgroundImage: "url('" + $that.attr( 'data-source' ) + "')",
                backgroundRepeat: ( ( $that.attr( 'data-type' ) == 'image-pattern' ) ? 'repeat' : 'no-repeat' ),
                backgroundSize: ( ( $that.attr( 'data-type' ) == 'image-pattern' ) ? 'auto' : 'cover' )
            } ).appendTo( '.slider' );

            $( '.slider' ).imagesLoaded( function( ) {
                $( this ).find( '.image' ).css( { opacity: 1 } );
            } );

            if ( $that.attr( 'data-parallax' ) == 'true' && ! Modernizr.touch ) {
                $( document ).ready( function( ) {
                    $( '.slider' ).find( '.image' ).css( { backgroundRepeat: 'repeat' } ).parallax( '50%', 0.25 );
                } );
            }

            if ( $( '#embed-video-control' ).length > 0 ) {
                $( '#embed-video-control' ).click( function( ) {
                    var $content = $that.find( '.content' ),
                        $current = $content.find( '> div:visible' ),
                        $staticRow = $current.find( '> div' ).not( '.hidden' ),
                        $videoRow = $current.find( '#embed-video' ),
                        $autocreate = $videoRow.find( '.autocreate' );

                    $current.animate( { opacity: 0 }, { duration: 300, queue: false, complete: function( ) {
                        $staticRow.hide( );
                        $videoRow.removeClass( 'hidden' );

                        var source = $autocreate.attr( 'data-source' );
                        if ( /\?/.test( source ) ) {
                            if ( ! /autoplay/i.test( source ) ) source += '&autoplay=1&wmode=transparent';
                        } else source += '?autoplay=1&rel=0&wmode=transparent';

                        $( '<iframe />' ).attr( {
                            width: $autocreate.attr( 'width' ) || 560,
                            height: $autocreate.attr( 'height' ) || 315,
                            src: source,
                            frameborder: 0,
                            allowfullscreen: 'allowfullscreen'
                        } ).appendTo( $videoRow.find( '.video-responsive' ) );
                        $autocreate.hide( );

                        verticalAlignContent( );
                        $current.animate( { opacity: 1 }, { duration: 300, queue: false } );
                    } } );
                } );

                $that.find( '.icon.close i' ).click( function( ) {
                    var $content = $that.find( '.content' ),
                        $current = $content.find( '> div:visible' ),
                        $staticRow = $current.find( '> div' ).not( '#embed-video' ),
                        $videoRow = $current.find( '#embed-video' );

                    $current.animate( { opacity: 0 }, { duration: 300, queue: false, complete: function( ) {
                        $current.find( 'iframe' ).remove( );
                        $staticRow.show( );
                        $videoRow.addClass( 'hidden' );

                        verticalAlignContent( );
                        $current.animate( { opacity: 1 }, { duration: 300, queue: false } );
                    } } );
                } );
            }
        }
        // Slideshow
        else if ( $that.attr( 'data-type' ) == 'slideshow' ) {
            useImages = true;

            var contentListShow = function( $that, $contentList, index ) {
                if ( ! $contentList ) {
                    $contentList = $( '#intro' );
                    var $current = $contentList;
                } else {
                    var $current = $contentList.find( '> div[data-index=' + index + ']' );
                }
                var $elements = $current.find( '.animate' );

                if ( $elements.length > 0 ) {
                    $elements.removeClass( 'complete' );
                    $current.show( );
                    verticalAlignContent( );

                    $( $elements ).each( function( i ) {
                        var $this = $( this );
                        setTimeout( function( ) {
                            $this.addClass( 'complete' );
                        }, ProdoOptions.intro.animateDelayFirst + ( i * ProdoOptions.intro.animateDelay ) );
                    } );
                } else {
                    $current.show( );
                    verticalAlignContent( );
                }
            };
            var contentListHide = function( $that, $contentList, onComplete ) {
                if ( $contentList ) {
                    var $current = $contentList.find( '> div:visible' );
                    if ( typeof $current !== 'undefined' ) {
                        $contentList.find( '> div' ).hide( );
                    }
                }
                if ( onComplete && typeof onComplete == 'function' ) onComplete( );
            };

            var $imagesList = $that.find( $that.attr( 'data-images' ) ),
                $contentList = $that.attr( 'data-content' ) ? $that.find( $that.attr( 'data-content' ) ) : false,
                changeContent = $contentList !== false ? true : false,
                $toLeft = $that.attr( 'data-to-left' ) ? $that.find( $that.attr( 'data-to-left' ) ) : false,
                $toRight = $that.attr( 'data-to-right' ) ? $that.find( $that.attr( 'data-to-right' ) ) : false,
                delay = parseInt( $that.attr( 'data-delay' ) ) > 0 ? parseInt( $that.attr( 'data-delay' ) ) * 1000 : 7000;

            $imagesList.hide( );
            if ( changeContent ) $contentList.find( '> div' ).hide( );

            var images = [];
            $imagesList.find( '> img' ).each( function( index ) {
                images.push( { src: $( this ).attr( 'src' ) } );
                $( this ).attr( 'data-index', index );
            } );

            if ( changeContent ) {
                $contentList.find( '> div' ).each( function( index ) {
                    $( this ).attr( 'data-index', index );
                } );
            }

            var slideshowTimeout = false, slideshowCurrent = 0, slideshowIsFirst = true;
            var tempInt = ProdoOptions.intro.animateDelayFirst;
            var slideshowChange = function( $that, index ) {
                if ( index >= images.length ) index = 0;
                else if ( index < 0 ) index = images.length - 1;
                slideshowCurrent = index;

                var isFirst = $that.find( '.image' ).length == 0 ? true : false;
                if ( isFirst ) {
                    $( '<div />' ).css( {
                        backgroundImage: "url('" + images[index].src + "')",
                        backgroundRepeat: 'no-repeat'
                    } ).addClass( 'image' ).appendTo( '.slider' );
                } else {
                    $( '<div />' ).css( {
                        backgroundImage: "url('" + images[index].src + "')",
                        backgroundRepeat: 'no-repeat',
                        opacity: 0
                    } ).addClass( 'image' ).appendTo( '.slider' );

                    setTimeout( function( ) {
                        $that.find( '.image:last-child' ).css( { opacity: 1 } );
                        setTimeout( function( ) {
                            $that.find( '.image:first-child' ).remove( );
                        }, 1500 );
                    }, 100 );
                }

                if ( $contentList || slideshowIsFirst ) {
                    contentListHide( $that, $contentList, function( ) {
                        if ( ! slideshowIsFirst ) {
                            if ( ProdoOptions.intro.animateDelayFirst == 0 ) ProdoOptions.intro.animateDelayFirst = tempInt;
                            contentListShow( $that, $contentList, index );
                        } else {
                            $( window ).on( 'prodo.complete', function( ) {
                                ProdoOptions.intro.animateDelayFirst = 0;
                                contentListShow( $that, $contentList, index );
                            } );
                        }
                    } );
                }
                slideshowIsFirst = false;

                clearTimeout( slideshowTimeout );
                slideshowTimeout = setTimeout( function( ) {
                    slideshowNext( $that );
                }, delay );
            };
            var slideshowCreate = function( ) {
                $( '<div />' ).addClass( 'slider fullscreen' ).prependTo( 'body' );
                $( window ).on( 'prodo.loaded', function( ) {
                    $imagesList.imagesLoaded( function( ) {
                        slideshowChange( $( '.slider' ), 0 );
                    } );
                } );
            };
            var slideshowNext = function( $slider ) {
                slideshowChange( $slider, slideshowCurrent + 1 );
            };
            var slideshowPrev = function( $slider ) {
                slideshowChange( $slider, slideshowCurrent - 1 );
            };

            slideshowCreate( );

            if ( $toLeft !== false && $toRight !== false ) {
                $toLeft.click( function( evt ) {
                    slideshowPrev( $( '.slider' ) );
                    evt.preventDefault( );
                } );
                $toRight.click( function( evt ) {
                    slideshowNext( $( '.slider' ) );
                    evt.preventDefault( );
                } );
            }
        }
        // Fullscreen Video
        else if ( $that.attr( 'data-type' ) == 'video' ) {
            useVideo = true;

            if ( Modernizr.touch ) {
                $( '#video-mode' ).removeClass( 'animate' ).hide( );
                useImages = true;
                useVideo = false;
            }

            var $elements = $that.find( '.animate' );
            if ( $elements.length > 0 ) {
                verticalAlignContent( );

                $( window ).on( 'prodo.complete', function( ) {
                    $( $elements ).each( function( i ) {
                        var $this = $( this );
                        setTimeout( function( ) {
                            $this.addClass( 'complete' );
                        }, 0 + ( i * ProdoOptions.intro.animateDelay ) );
                    } );
                } )
            } else {
                verticalAlignContent( );
            }

            if ( Modernizr.touch ) {
                $( '<div />' ).addClass( 'slider fullscreen' ).prependTo( 'body' );
                $( '<div />' ).addClass( 'image' ).css( {
                    opacity: 0,
                    backgroundImage: "url('" + $that.attr( 'data-on-error' ) + "')",
                    backgroundRepeat: 'no-repeat'
                } ).appendTo( '.slider' );

                $( '.slider' ).imagesLoaded( function( ) {
                    $( this ).find( '.image' ).css( { opacity: 1 } );
                } );
            } else {
                $( document ).ready( function( ) {
                    var reserveTimer, onlyForFirst = true;
                    $( '[data-hide-on-another="true"]' ).remove( );

                    $( window ).on( 'YTAPIReady', function( ) {
                        reserveTimer = setTimeout( function( ) {
                            $( window ).trigger( 'prodo.intro-video' );
                            onlyForFirst = false;
                        }, 5000 );
                    } );
                    $( '<div />' ).addClass( 'slider fullscreen' ).prependTo( 'body' ).on( 'YTPStart', function( ) {
                            if ( onlyForFirst ) {
                                clearTimeout( reserveTimer );
                                $( window ).trigger( 'prodo.intro-video' );
                                onlyForFirst = false;
                            }
                        } ).mb_YTPlayer( {
                        videoURL: $that.attr( 'data-source' ),
                        containment: '.slider',
                        mute: $that.attr( 'data-mute' ) == 'true' ? true : false,
                        startAt: parseInt( $that.attr( 'data-start' ) ),
                        autoPlay: true,
                        showControls: false,
                        ratio: '16/9',
                        showYTLogo: false,
                        vol: 100,
                        onError: function( ) {
                            clearTimeout( reserveTimer );
                            $( window ).trigger( 'prodo.intro-video' );
                        }
                    } );
                    if ( $that.attr( 'data-overlay' ) ) {
                        $( '<div />' ).addClass( 'overlay' ).css( { width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba( 0, 0, 0, ' + $that.attr( 'data-overlay' ) + ' )' } ).appendTo( '.slider.fullscreen' );
                    }
                } );

                var videoMode = false, videoModeSelector = '#intro .mouse, #intro .content, .slider.fullscreen .overlay';
                $( '#video-mode' ).click( function( ) {
                    $( videoModeSelector ).animate( { opacity: 0 }, { duration: 500, queue: false, complete: function( ) {
                        if ( ! videoMode ) {
                            $( '.slider' ).unmuteYTPVolume( );
                            $( '<div />' ).appendTo( '#intro' ).css( {
                                position: 'absolute',
                                textAlign: 'center',
                                bottom: '30px',
                                color: '#FFF',
                                left: 0,
                                right: 0,
                                opacity: 0
                            } ).addClass( 'click-to-exit' );
                            $( '<h5 />' ).appendTo( '.click-to-exit' ).text( 'Click to exit full screen' );

                            setTimeout( function( ) {
                                $( '.click-to-exit' ).animate( { opacity: 1 }, { duration: 500, queue: false, complete: function( ) {
                                    setTimeout( function( ) {
                                        $( '.click-to-exit' ).animate( { opacity: 0 }, { duration: 500, queue: false, complete: function( ) {
                                            $( this ).remove( );
                                        } } )
                                    }, 1500 );
                                } } );
                            }, 500 );
                        }

                        videoMode = true;
                        $( this ).hide( );
                    } } );
                } );

                $that.click( function( evt ) {
                    if ( videoMode && $( evt.target ).is( '#intro' ) ) {
                        $( '.slider' ).muteYTPVolume( );
                        $( videoModeSelector ).show( ).animate( { opacity: 1 }, { duration: 500, queue: false } );
                        $that.find( '.click-to-exit' ).remove( );
                        videoMode = false;
                    }
                } );
            }
        }
    },

    // Portfolio
    portfolio: function( ) {
        if ( $( '.portfolio-item' ).length == 0 ) {
            return;
        }

        var calculatePortfolioItems = function( ) {
            var sizes = { lg: 6, md: 6, sm: 4, xs: 2 }, $that = $( '.portfolio-items' ),
                w = $( window ).width( ), onLine = 0, value = 0;

            if ( $that.attr( 'data-on-line-lg' ) > 0 ) sizes.lg = parseInt( $that.attr( 'data-on-line-lg' ) );
            if ( $that.attr( 'data-on-line-md' ) > 0 ) sizes.md = parseInt( $that.attr( 'data-on-line-md' ) );
            if ( $that.attr( 'data-on-line-sm' ) > 0 ) sizes.sm = parseInt( $that.attr( 'data-on-line-sm' ) );
            if ( $that.attr( 'data-on-line-xs' ) > 0 ) sizes.xs = parseInt( $that.attr( 'data-on-line-xs' ) );

            if ( w <= 767 ) onLine = sizes.xs;
            else if ( w >= 768 && w <= 991 ) onLine = sizes.sm;
            else if ( w >= 992 && w <= 1199 ) onLine = sizes.md;
            else onLine = sizes.lg;

            value = Math.floor( w / onLine );
            $( '.portfolio-item' ).css( { width: value + 'px', height: value + 'px' } );
        };

        $( window ).resize( function( ) {
            calculatePortfolioItems( );
        } );
        $( document ).ready( function( ) {
            calculatePortfolioItems( );
            $( '.portfolio-items' ).isotope( {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            } );
        } );

        $( '.portfolio-filters a' ).click( function( evt ) {
            var $that = $( this );
            $( '.portfolio-filters a' ).removeClass( 'active' );
            $that.addClass( 'active' );

            $( '.portfolio-items' ).isotope( { filter: $that.attr( 'data-filter' ) } );
            evt.preventDefault( );
        } );

        var closeProject = function( ) {
            $( '#portfolio-details' ).parent( ).animate( { opacity: 0 }, { duration: 600, queue: false } );
            $( '#portfolio-details' ).parent( ).animate( { height: 0 }, { duration: 700, queue: false, complete: function( ) {
                $( this ).find( '#portfolio-details' ).hide( ).html( '' ).removeAttr( 'data-current' );
                $( this ).css( { height: 'auto', opacity: 1 } );
            } } );
        };

        // IE < 10 Fix
        $( '.portfolio-item' ).click( function( evt ) {
            if ( $( evt.target ).is( '.portfolio-item' ) ) {
                $( this ).find( 'a' ).click( );
            }
        } ).find( 'img' ).click( function( evt ) {
            if ( $( evt.target ).is( 'img' ) ) {
                $( this ).parent( ).find( 'a' ).click( );
            }
        } );
        // IE < 10 Fix

        $( '.portfolio-item a' ).filter( '[data-url]' ).click( function( evt ) {
            var $that = $( this );
            if ( $that.parent( ).find( '.loading' ).length == 0 ) {
                $( '<div />' ).addClass( 'loading' ).appendTo( $that.parent( ) );
                $that.parent( ).addClass( 'active' );

                var $loading = $( this ).parent( ).find( '.loading' ),
                    $container = $( '#portfolio-details' ), $parent = $container.parent( ), timer = 1, projectRel;

                if ( $container.is( ':visible' ) ) {
                    closeProject( );
                    timer = 800;
                    $loading.animate( { width: '70%' }, { duration: 2000, queue: false } );
                }

                setTimeout( function( ) {
                    $loading.stop( true, false ).animate( { width: '70%' }, { duration: 6000, queue: false } );
                    $.get( $that.attr( 'data-url' ) ).done( function( response ) {
                        $container.html( response );
                        $container.imagesLoaded( function( ) {
                            $loading.stop( true, false ).animate( { width: '100%' }, { duration: 500, queue: true } );
                            $loading.animate( { opacity: 0 }, { duration: 200, queue: true, complete: function( ) {
                                $that.parent( ).removeClass( 'active' );
                                $( this ).remove( );

                                $parent.css( { opacity: 0, height: 0 } );
                                $container.show( );

                                ProdoTheme.imageSlider( $container, function( ) {
                                    $( document ).scrollTo( $container, 600, { offset: { top: -85, left: 0 } } );
                                    $parent.animate( { opacity: 1 }, { duration: 700, queue: false } );
                                    $parent.animate( { height: $container.outerHeight( true ) }, { duration: 600, queue: false, complete: function( ) {
                                        projectRel = $that.parent( ).is( '.portfolio-item' ) ? $that.parent( ) : $that.parent( ).parent( );
                                        $( this ).css( { height: 'auto' } );
                                        $container.attr( 'data-current', projectRel.attr( 'rel' ) );
                                    } } );
                                } );
                            } } );
                        } );
                    } ).fail( function( ) {
                        $that.parent( ).removeClass( 'active' );
                        $loading.remove( );
                    } );
                }, timer );
            }
            evt.preventDefault( );
        } );

        $( document.body ).on( 'click', '#portfolio-details .icon.close i', function( ) {
            closeProject( );
        } );

        // Anchor Links for Projects
        var dh = document.location.hash;
        if ( /#view-/i.test( dh ) ) {
            var $item = $( '[rel="' + dh.substr( 6 ) + '"]' );
            if ( $item.length > 0 ) {
                $( document ).scrollTo( '#portfolio', 0, { offset: { top: 0, left: 0 } } );
                $( window ).on( 'prodo.complete', function( ) {
                    $item.trigger( 'click' );
                } );
            }
        }
        $( 'a[href^="#view-"]' ).click( function( ) {
            var $item = $( '[rel="' + $( this ).attr( 'href' ).substr( 6 ) + '"]' );
            if ( $item.length > 0 ) {
                $( document ).scrollTo( '#portfolio', ProdoOptions.scrollSpeed, { offset: { top: -85, left: 0 }, onAfter: function( ) {
                    $item.trigger( 'click' );
                } } );
            }
        } );
    },

    // Parallax Sections
    parallax: function( ) {
        if ( $( '.parallax' ).length == 0 ) {
            return;
        }

        $( window ).load( function( ) {
            $( '.parallax' ).each( function( ) {
                if ( $( this ).attr( 'data-image' ) ) {
                    $( this ).css( { backgroundImage: 'url( ' + $( this ).attr( 'data-image' ) + ' )' } );
                    if ( ProdoOptions.parallax && ! Modernizr.touch && ! /MSIE/.test( navigator.userAgent ) ) {
                        $( this ).parallax( '50%', 0.5 );
                    }
                }
            } );
        } );
    },

    // Video Background for Sections
    videos: function( ) {
        if ( Modernizr.touch ) {
            $( '.section.video' ).remove( );
            return;
        }

        if ( $( '.section.video' ).length > 0 ) {
            var tag = document.createElement( 'script' );
            tag.src = "http://www.youtube.com/player_api";
            var firstScriptTag = document.getElementsByTagName( 'script' )[0];
            firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

            $( window ).resize( function( ) {
                $( '.section.video' ).each( function( ) {
                    $( this ).css( { height: $( this ).find( '.video-container .container' ).outerHeight( true ) } );
                } );
            } ).resize( );
        }
    },

    // Google Maps
    map: function( ) {
        if ( $( '#google-map' ).length == 0 ) {
            return;
        }

        var $map = $( '#google-map' );
        $( window ).load( function( ) {
            var coordY = $map.attr( 'data-latitude' ), coordX = $map.attr( 'data-longitude' );
            var latlng = new google.maps.LatLng( coordY, coordX );
            var settings = {
                zoom: 14,
                center: new google.maps.LatLng( coordY, coordX ),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                scrollwheel: false,
                draggable: true,
                mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
                navigationControl: false,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
                styles: [ { "stylers": [ { "saturation": -100 }, { "lightness": 20 }, { "gamma": 1.2 } ] } ]
            };
            var map = new google.maps.Map( $map.get( 0 ), settings );
            google.maps.event.addDomListener( window, "resize", function( ) {
                var center = map.getCenter( );
                google.maps.event.trigger( map, "resize" );
                map.setCenter( center );
            } );
            var contentString = $map.parent( ).find( '#map-info' ).html( ) || '';
            var infowindow = new google.maps.InfoWindow( { content: contentString } );
            var companyImage = new google.maps.MarkerImage( 'images/marker.png', null, null, new google.maps.Point( 27, 62 ), new google.maps.Size( 54, 64 ) );
            var companyPos = new google.maps.LatLng( coordY, coordX );
            var companyMarker = new google.maps.Marker( {
                position: companyPos,
                map: map,
                icon: companyImage,
                zIndex: 3
            } );
            google.maps.event.addListener( companyMarker, 'click', function( ) {
                infowindow.open( map, companyMarker );
            } );

            // Shadow for Map
            $( '<i />' ).addClass( 'shadow-top' ).appendTo( $map.parent( ) );
            $( '<i />' ).addClass( 'shadow-bottom' ).appendTo( $map.parent( ) );
        } );
    },

    // Content Slider
    contentSlider: function( $root, element ) {
        if ( typeof $root === 'undefined' ) $root = $( 'body' );
        if ( typeof element === 'undefined' ) element = 'div';

        $root.find( '.content-slider' ).each( function( ) {
            var $that = $( this ), timeout, delay = false, process = false;
            $that.css( { position: 'relative' } ).find( '> ' + element ).each( function( index ) {
                $that.height( $( this ).outerHeight( true ) );
                $( this ).attr( 'data-index', index );
                $( this ).css( { position: 'relative', left: 0, top: 0 } );
                if ( index > 0 ) $( this ).hide( );
                else $that.attr( 'data-index', 0 );
            } );

            if ( $that.attr( 'data-arrows' ) ) {
                var $arrows = $( $that.attr( 'data-arrows' ) );
            } else {
                var $arrows = $that.parent( );
            }

            if ( $that.attr( 'data-delay' ) ) {
                delay = parseInt( $that.attr( 'data-delay' ) );
                timeout = setInterval( function( ) {
                    $arrows.find( '.arrow.right' ).click( );
                }, delay );
            }
            if ( $that.find( '> ' + element + '[data-index]' ).length < 2 ) {
                $arrows.hide( );
                clearInterval( timeout );
                delay = false;
            }

            $arrows.find( '.arrow' ).click( function( ) {
                if ( ! process ) {
                    process = true;
                    clearInterval( timeout );

                    var index = parseInt( $that.attr( 'data-index' ) ), last = parseInt( $that.find( '> ' + element + ':last-child' ).attr( 'data-index' ) ), set;
                    if ( $( this ).hasClass( 'left' ) ) {
                        set = index == 0 ? last : index - 1;
                        var property = [ { left: 100 }, { left: -100 } ];
                    } else {
                        set = index == last ? 0 : index + 1;
                        var property = [ { left: -100 }, { left: 100 } ];
                    }
                    var $current = $that.find( '> ' + element + '[data-index=' + index + ']' ),
                        $next = $that.find( '> ' + element + '[data-index=' + set + ']' );

                    $that.attr( 'data-index', set );
                    $current.css( { left: 'auto', right: 'auto' } );
                    $current.animate( { opacity: 0 }, { duration: 300, queue: false } );

                    $current.animate( property[0], { duration: 300, queue: false, complete: function( ) {
                        $( this ).hide( ).css( { opacity: 1 } ).css( { left: 0 } );

                        $that.animate( { height: $next.outerHeight( true ) }, { duration: ( ( $that.outerHeight( true ) == $next.outerHeight( true ) ) ? 0 : 200 ), queue: false, complete: function( ) {
                            $next.css( { opacity: 0, left: 'auto', right: 'auto' } ).css( property[1] ).show( );
                            $next.animate( { opacity: 1 }, { duration: 300, queue: false } );

                            $next.animate( { left: 0 }, { duration: 300, queue: false, complete: function( ) {
                                if ( delay !== false ) {
                                    timeout = setInterval( function( ) {
                                        $arrows.find( '.arrow.right' ).click( );
                                    }, delay );
                                }
                                process = false;
                            } } );
                        } } );
                    } } );
                }
            } );

            $( window ).resize( function( ) {
                $that.each( function( ) {
                    $( this ).height( $( this ).find( '> ' + element + ':visible' ).outerHeight( true ) );
                } );
            } ).resize( );
        } );
    },

    // Contact Form
    contact: function( ) {
        if ( $( '#contact' ).length == 0 ) {
            return;
        }

        var $name = $( '.field-name' ), $email = $( '.field-email' ), $phone = $( '.field-phone' ),
            $text = $( '.field-message' ), $button = $( '#contact-submit' );

        $( '.field-name, .field-email, .field-message' ).focus( function( ) {
            if ( $( this ).parent( ).find( '.error' ).length > 0 ) $( this ).parent( ).find( '.error' ).fadeOut( 150, function( ) {
                $( this ).remove( );
            } );
        } );

        $button.removeAttr( 'disabled' );
        $button.click( function( ) {
            var $that = $( this );
            var fieldNotice = function( $that ) {
                if ( $that.parent( ).find( '.error' ).length == 0 ) {
                    $( '<span class="error"><i class="fa fa-times"></i></span>' ).appendTo( $that.parent( ) ).fadeIn( 150 );
                }
            };

            if ( $name.val( ).length < 1 ) fieldNotice( $name );
            if ( $email.val( ).length < 1 ) fieldNotice( $email );
            if ( $text.val( ).length < 1 ) fieldNotice( $text );

            if ( $( '#contact' ).find( '.field .error' ).length == 0 ) {
                $( document ).ajaxStart( function( ) {
                    $button.attr( 'disabled', true );
                } );
                $.post( 'ajax/contact.php', {
                    name: $name.val( ), email: $email.val( ),
                    phone: $phone.val( ), message: $text.val( )
                }, function( response ) {
                    var data = $.parseJSON( response );
                    if ( data.status == 'email' ) {
                        fieldNotice( $email );
                        $button.removeAttr( 'disabled' );
                    } else if ( data.status == 'error' ) {
                        $button.text( 'Unknown Error :(' );
                    } else {
                        $( '.contact-form-area' ).animate( { opacity: 0 }, { duration: 200, queue: false } );
                        $( '.contact-form-area' ).animate( { height: $( '.contact-form-result' ).outerHeight( true ) }, { duration: 300, queue: false, complete: function( ) {
                            $( this ).css( { height: 'auto' } ).hide( );
                            $( '.contact-form-result' ).fadeIn( 300 );
                        } } );
                    }
                } );
            }
        } );
    },

    // Tweaks for Oldest Browsers
    tweaks: function( ) {
        // Input Placeholders
        if ( ! Modernizr.input.placeholder ) {
            $( 'input[placeholder], textarea[placeholder]' ).each( function( ) {
                $( this ).val( $( this ).attr( 'placeholder' ) ).focusin( function( ) {
                    if ( $( this ).val( ) == $( this ).attr( 'placeholder' ) ) $( this ).val( '' );
                } ).focusout( function( ) {
                    if ( $( this ).val( ) == 0 ) $( this ).val( $( this ).attr( 'placeholder' ) );
                } );
            } );
        }

        // Error Pages
        if ( $( '#error-page' ).length > 0 ) {
            $( window ).resize( function( ) {
                $( '#error-page' ).css( { marginTop: - Math.ceil( $( '#error-page' ).outerHeight( ) / 2 ) } );
            } ).resize( );
        }
    },

    // Shortcodes
    shortcodes: function( ) {
        // Progress Bars
        if ( $( '.progress .progress-bar' ).length > 0 ) {
            setTimeout( function( ) {
                $( window ).on( 'prodo.complete', function( ) {
                    $( window ).scroll( function( ) {
                        var scrollTop = $( window ).scrollTop( );
                        $( '.progress .progress-bar' ).each( function( ) {
                            var $that = $( this ), itemTop = $that.offset( ).top - $( window ).height( ) + $that.height( ) / 2;
                            if ( scrollTop > itemTop && $that.outerWidth( ) == 0 ) {
                                var percent = $( this ).attr( 'aria-valuenow' ) + '%';
                                var $value = $( this ).parent( ).parent( ).find( '.progress-value' );
                                if ( $value.length > 0 ) $value.css( { width: percent, opacity: 0 } ).text( percent );

                                $that.animate( { width: percent }, { duration: 1500, queue: false, complete: function( ) {
                                    if ( $value.length > 0 ) {
                                        $value.animate( { opacity: 1 }, { duration: 300, queue: false } );
                                    }
                                } } );
                            }
                        } );
                    } ).scroll( );
                } );
            }, 1 );
        }

        // Circular Bars
        if ( $( '.circular-bars' ).length > 0 ) {
            if ( Modernizr.canvas ) {
                $( '.circular-bars input' ).each( function( ) {
                    $( this ).val( 0 ).knob( {
                        fgColor: $( this ).attr( 'data-color' ) || $( 'a' ).css( 'color' ),
                        width: '90px',
                        readOnly: true,
                        thickness: .10
                    } );
                } );
                setTimeout( function( ) {
                    $( window ).on( 'prodo.complete', function( ) {
                        $( window ).scroll( function( ) {
                            var scrollTop = $( window ).scrollTop( );
                            $( '.circular-bars input' ).each( function( ) {
                                var $that = $( this ), itemTop = $that.offset( ).top - $( window ).height( ) + $that.height( ) / 2;
                                if ( scrollTop > itemTop && $that.val( ) == 0 ) {
                                    $( { value: 0 } ).animate( { value: $that.attr( 'data-value' ) }, {
                                        duration: 1500,
                                        queue: false,
                                        step: function( ) {
                                            $that.val( Math.ceil( this.value ) ).trigger( 'change' );
                                        }
                                    } );
                                }
                            } );
                        } ).scroll( );
                    } );
                }, 1 );
            } else {
                var value;
                $( '.circular-bars' ).each( function( ) {
                    if ( $( this ).attr( 'data-on-error-hide' ) ) {
                        value = $( this ).attr( 'data-on-error-hide' );
                        if ( value == 'this' ) $( this ).hide( );
                        else $( value ).hide( );
                    }
                } );
            }
        }

        // Milestone Counters
        if ( $( '.milestone' ).length > 0 ) {
            $( '.milestone' ).each( function( ) {
                $( this ).find( '.counter' ).text( '0' );
            } );
            setTimeout( function( ) {
                $( window ).on( 'prodo.complete', function( ) {
                    $( window ).scroll( function( ) {
                        var scrollTop = $( window ).scrollTop( );
                        $( '.milestone' ).each( function( ) {
                            var $that = $( this ), $counter = $that.find( '.counter' ),
                                itemTop = $that.offset( ).top - $( window ).height( ) + $that.height( ) / 2;
                            if ( scrollTop > itemTop && parseInt( $counter.text( ) ) == 0 ) {
                                $( { value: parseInt( $counter.attr( 'data-from' ) ) } ).animate( {
                                    value: $counter.attr( 'data-to' )
                                }, {
                                    duration: parseInt( $counter.attr( 'data-speed' ) ) || 2000,
                                    queue: false,
                                    step: function( ) {
                                        $counter.text( Math.ceil( this.value ) );
                                    }
                                } );
                            }
                        } );
                    } ).scroll( );
                } );
            }, 1 );
        }
    },

    // Images Slider
    imageSlider: function( $root, onComplete ) {
        if ( typeof $root === 'undefined' ) $root = $( 'body' );
        if ( $root.find( '.image-slider' ).length == 0 ) {
            if ( onComplete && typeof onComplete == 'function' ) onComplete( );
            return;
        }

        $root.find( '.image-slider' ).each( function( ) {
            var $that = $( this ), $arrows = $that.find( '.arrows' );
            var $list = $( this ).find( '> div' ).not( '.arrows' );
            var timeout, delay = false, process = false;

            var setHeight = function( $that, onComplete ) {
                $that.css( {
                    height: $that.find( '> div:visible img' ).outerHeight( true )
                } );
                if ( onComplete && typeof onComplete == 'function' ) onComplete( );
            };

            if ( $that.attr( 'data-delay' ) ) {
                delay = parseInt( $that.attr( 'data-delay' ) );
                timeout = setInterval( function( ) {
                    $arrows.find( '.arrow.right' ).click( );
                }, delay );
            }

            $( this ).imagesLoaded( function( ) {
                $( this ).css( { position: 'relative' } );
                $list.hide( ).css( {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    width: '100%',
                    paddingLeft: 15,
                    paddingRight: 15,
                } );
                $list.eq( 0 ).show( );

                setHeight( $that, onComplete );
                $( window ).resize( function( ) {
                    setTimeout( function( ) {
                        setHeight( $that );
                    }, 1 );
                } );

                if ( $list.length == 1 ) {
                    $arrows.hide( );
                    clearInterval( timeout );
                    delay = false;
                }
            } );

            $arrows.find( '.arrow' ).on( 'click', function( evt ) {
                if ( process ) {
                    evt.preventDefault( );
                    return;
                }
                clearInterval( timeout );

                var isRight = $( this ).hasClass( 'right' );
                var $current = $that.find( '> div:visible' ).not( '.arrows' ), $next;

                if ( isRight ) {
                    $next = $current.next( );
                    if ( ! $next || $next.is( '.arrows' ) ) $next = $list.eq( 0 );
                } else {
                    if ( $current.is( ':first-child' ) ) $next = $list.last( );
                    else $next = $current.prev( );
                }

                process = true;
                $current.css( { zIndex: 1 } );
                $next.css( { opacity: 0, zIndex: 2 } ).show( ).animate( { opacity: 1 }, { duration: 300, queue: false, complete: function( ) {
                    $current.hide( ).css( { opacity: 1 } );
                    
                    if ( delay !== false ) {
                        timeout = setInterval( function( ) {
                            $arrows.find( '.arrow.right' ).click( );
                        }, delay );
                    }
                    process = false;
                } } );
            } );
        } );
    },

    // Twitter Widget
    twitter: function( ) {
        if ( $( '.twitter-feed' ).length == 0 ) {
            return;
        }
        
        $( window ).load( function( ) {
            $( '.twitter-feed' ).bind( 'loaded', function( ) {
                $( this ).find( 'ul' ).addClass( 'content-slider' ).attr( 'data-arrows', $( this ).attr( 'data-arrows' ) );
                if ( $( this ).attr( 'data-delay' ) ) $( this ).find( 'ul' ).attr( 'data-delay', $( this ).attr( 'data-delay' ) );
                ProdoTheme.contentSlider( $( this ), 'li' );
            } ).tweet( {
                modpath: './twitter/',
                username: $( '.twitter-feed' ).attr( 'data-user' ),
                join_text: 'auto',
                avatar_size: 0,
                count: 5
            } );
        } );
    },

    // Share Functions
    share: function( network, title, image, url ) {
        // Window Size
        var w = 650, h = 350, params = 'width=' + w + ', height=' + h + ', resizable=1';

        // Select Data
        if ( typeof title === 'undefined' ) title = $( 'title' ).text( );
        else if ( typeof title === 'string' ) {
            if ( $( title ).length > 0 ) title = $( title ).text( );
        }
        if ( typeof image === 'undefined' ) image = '';
        else if ( typeof image === 'string' ) {
            if ( ! /http/i.test( image ) ) {
                if ( $( image ).length > 0 ) {
                    if ( $( image ).is( 'img' ) ) image = $( image ).attr( 'src' );
                    else image = $( image ).find( 'img' ).eq( 0 ).attr( 'src' );
                } else image = '';
            }
        }
        if ( typeof url === 'undefined' ) url = document.location.href;
        else url = document.location.protocol + '//' + document.location.host + document.location.pathname + url;

        // Share
        if ( network == 'twitter' ) {
            return window.open( 'http://twitter.com/intent/tweet?text=' + encodeURIComponent( title + ' ' + url ), 'share', params );
        } else if ( network == 'facebook' ) {
            return window.open( 'https://www.facebook.com/sharer/sharer.php?s=100&p[url]=' + encodeURIComponent( url ) + '&p[title]=' + encodeURIComponent( title ) + '&p[images][0]=' + encodeURIComponent( image ), 'share', params );
        } else if ( network == 'pinterest' ) {
            window.open( 'http://pinterest.com/pin/create/bookmarklet/?media=' + image + '&description=' + title + ' ' + encodeURIComponent( url ), 'share', params );
        } else if ( network == 'google' ) {
            return window.open( 'https://plus.google.com/share?url=' + encodeURIComponent( url ), 'share', params );
        } else if ( network == 'linkedin' ) {
            return window.open( 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent( url ) + '&title=' + title, 'share', params );
        }
        return;
    },

    // Blog
    blog: function( ) {
        if ( $( '.blog-masonry' ).length == 0 ) {
            return;
        }

        // Get Column Width
        function getColumnWidth( ) {
            var $that = $( '.blog-masonry' ), w = $that.outerWidth( true ) - 30,
                ww = $( window ).width( ), columns;

            if ( $that.hasClass( 'blog-masonry-four' ) ) columns = 4;
            else if ( $that.hasClass( 'blog-masonry-three' ) ) columns = 3;
            else if ( $that.hasClass( 'blog-masonry-two' ) ) columns = 2;
            else columns = 1;

            if ( ww <= 767 ) columns = 1;
            else if ( ww >= 768 && ww <= 991 && columns > 2 ) columns -= 1;
            return Math.floor( w / columns );
        }

        $( '.blog-post.masonry' ).css( { width: getColumnWidth( ) } );
        $( '.blog-masonry' ).imagesLoaded( function( ) {
            $( this ).isotope( {
                itemSelector: '.blog-post.masonry',
                resizable: false,
                transformsEnabled: false,
                masonry: { columnWidth: getColumnWidth( ) }
            } );
        } );

        $( window ).resize( function( ) {
            var size = getColumnWidth( );
            $( '.blog-post.masonry' ).css( { width: size } );
            $( '.blog-masonry' ).isotope( {
                masonry: { columnWidth: size }
            } );
        } );
    },

    // Animations
    animations: function( ) {
        if ( Modernizr.touch ) {
            ProdoOptions.animations = false;
        }
        if ( ! ProdoOptions.animations ) {
            $( '.animation[class*="animation-"]' ).removeClass( 'animation' );
        } else {
            var animationItem = $( '.animation[class*="animation-"]' );
            if ( animationItem.length ) {
                var delay;
                animationItem.not( '.active' ).each( function( i ) {
                    if ( i != 0 && $( this ).offset( ).top == $( animationItem.get( i - 1 ) ).offset( ).top ) {
                        delay ++
                    } else delay = 0;
                    $( this ).css( {
                        '-webkit-transition-delay': delay * 150 + 'ms',
                        '-moz-transition-delay': delay * 150 + 'ms',
                        '-o-transition-delay': delay * 150 + 'ms',
                        '-ms-transition-delay': delay * 150 + 'ms',
                        'transition-delay': delay * 150 + 'ms'
                    } );
                } );
                setTimeout( function( ) {
                    $( window ).on( 'prodo.complete', function( ) {
                        $( window ).scroll( function( ) {
                            var scrollTop = $( window ).scrollTop( );
                            animationItem.not( '.active' ).each( function( ) {
                                var $that = $( this ), itemTop = $that.offset( ).top - $( window ).height( ) + $that.outerHeight( ) / 2;
                                if ( scrollTop > itemTop ) $( this ).addClass( 'active' );
                            } );
                        } ).scroll( );
                    } );
                }, 1 );
            }
        }

        /*** How it looks (iMacs Preview) ***/
        if ( $( '.imacs' ).length > 0 ) {
            if ( ! ProdoOptions.animations ) {
                $( '.imacs' ).find( '.item' ).not( '.center' ).addClass( 'complete' );
                return;
            }
            setTimeout( function( ) {
                $( window ).on( 'prodo.complete', function( ) {
                    $( window ).scroll( function( ) {
                        var scrollTop = $( window ).scrollTop( );
                        $( '.imacs' ).find( '.item' ).not( '.complete' ).each( function( ) {
                            var $that = $( this ), itemTop = $that.offset( ).top - $( window ).height( ) + $that.height( ) / 2;
                            if ( scrollTop > itemTop && ! $that.hasClass( 'center' ) ) {
                                $that.addClass( 'complete' );
                            }
                        } );
                    } ).scroll( );
                } );
            }, 1 );
        }
    }
};

// Initialize
ProdoTheme.init( );

// Share Functions
function shareTo( network, title, image, url ) {
    return ProdoTheme.share( network, title, image, url );
}

// Video Background for Sections
function onYouTubeIframeAPIReady( ) {
    $( '.section.video' ).each( function( index ) {
        var $that = $( this ), currentId = 'video-background-' + index;
        $( '<div class="video-responsive"><div id="' + currentId + '"></div></div>' ).prependTo( $that );

        var player = new YT.Player( currentId, {
            height: '100%',
            width: '100%',            
            playerVars: {
                'rel': 0,
                'autoplay': 1,
                'loop': 1,
                'controls': 0,
                'start': parseInt( $that.attr( 'data-start' ) ),
                'autohide': 1,
                'wmode': 'opaque',
                'playlist': currentId
            },
            videoId: $that.attr( 'data-source' ),
            events: {
                'onReady': function( evt ) {
                    evt.target.mute( );
                },
                'onStateChange': function( evt ) {
                    if ( evt.data === 0 ) evt.target.playVideo( );
                }
            }
        } );
    } );
}
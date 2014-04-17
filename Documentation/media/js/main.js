/**
 * Documentation
 * http://axminenko.com
 *
 * Copyright 2014 Alexander Axminenko
 */
"use strict";

function docNavigation( ) {
    $( '.section' ).hide( ).eq( 0 ).show( );

    $( 'a[data-area]' ).click( function( evt ) {
        var $area = $( $( this ).attr( 'data-area' ) );
        evt.preventDefault( );

        $( 'a[data-area]' ).parent( ).removeClass( 'active' );
        $( this ).parent( ).addClass( 'active' );

        if ( $area.length > 0 ) {
            $( document ).scrollTop( 0 );
            $( '.section' ).hide( );
            $area.show( );
        }
    } );
}

$( document ).ready( function( ) {
    docNavigation( );
} );
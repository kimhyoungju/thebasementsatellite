<?php
/**
 * Prodo v1.1
 * Onepage HTML template
 * http://axminenko.com
 *
 * Copyright 2014 Alexander Axminenko
 */
$params = array(
    'to' => 'your@mail.com', // Your Personal Email, example: a.axminenko@gmail.com
    'from' => 'noreply@mail.com' // Your "Noreply" Email, example: noreply@axminenko.com
);

$name = trim( $_POST['name'] );
$email = trim( $_POST['email'] );
$phone = trim( $_POST['phone'] );
$message = trim( $_POST['message'] );

if ( empty( $name ) or empty( $message ) ) {
    echo json_encode( array( 'status' => 'error' ) );
} else if ( empty( $email ) or ! filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
    echo json_encode( array( 'status' => 'email' ) );
} else {
    $headers = 'From: ' . $name . ' ' . $params['from'] . "\r\n" .
    'Reply-To: ' . $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion( );
    $message = str_replace( array( "\r", "\n" ), array( '', "\r\n" ), $message );

    if ( mail( $params['to'], ( empty( $phone ) ? 'New message (Without Phone Number)' : 'New message (Phone: ' . $phone . ')' ), $message, $headers ) ) {
        echo json_encode( array( 'status' => 'ok' ) );
    } else {
        echo json_encode( array( 'status' => 'error' ) );
    }
}
?>
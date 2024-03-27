<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include('classes.php');

if (isset($_GET['email'])) {
    $email = $_GET['email'];

    // Create an instance of the User class
    $user = new User();

    // Check if the email exists
    $emailExists = $user->checkEmailExists($email);

    // Return the result as JSON
    echo json_encode(['exists' => $emailExists]);
} else {
    // If email parameter is not provided
    echo json_encode([
        'error' => 'Email parameter not provided'
    ]);
}
?>
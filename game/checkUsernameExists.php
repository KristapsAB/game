<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include('classes.php');

if (isset($_GET['username'])) {
    $username = $_GET['username'];

    $user = new User();

    $usernameExists = $user->checkUsernameExists($username);

    echo json_encode([
        'exists' => $usernameExists,
    ]);
} else {
    echo json_encode([
        'error' => 'Username not provided',
    ]);
}
?>
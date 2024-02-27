<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include 'classes.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->username) && isset($data->password)) {
    $email = $data->email;
    $username = $data->username;
    $password = $data->password;

    // Initialize User class
    $user = new User();

    // Check if user with the same email or username already exists
    if (!$user->checkUserExists($email, $username)) {
        // If user does not exist, create the new user
        if ($user->createUser($email, $username, $password)) {
            echo json_encode(array("success" => true, "message" => "User registered successfully"));
        } else {
            echo json_encode(array("success" => false, "message" => "Error registering user"));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "User already exists"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Invalid input"));
}

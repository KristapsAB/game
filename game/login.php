<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'classes.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;

    $user = new User();

    if ($user->validateUser($email, $password)) {
        $userData = $user->getUserData($email);
        echo json_encode(array("success" => true, "message" => "Login successful", "userData" => $userData));
    } else {
        echo json_encode(array("success" => false, "message" => "Invalid email or password"));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Invalid input"));
}

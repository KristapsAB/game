<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include your database connection file
include('classes.php');

// Create an instance of the User class
$user = new User();

// Check if the user ID is provided in the query parameters
if (isset($_GET['id'])) {
    $userId = $_GET['id'];

    // Query to get user profile data
    $query = "SELECT * FROM users WHERE id = :userId";

    // Use a prepared statement
    $stmt = $user->getConn()->prepare($query);
    $stmt->bindParam(":userId", $userId);
    $stmt->execute();

    // Fetch user data
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
        // Return user data as JSON
        echo json_encode([
            'success' => true,
            'userData' => $userData
        ]);
    } else {
        // Error in query
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching user profile'
        ]);
    }
} else {
    // User ID is not provided in the query parameters
    echo json_encode([
        'success' => false,
        'message' => 'User ID not provided'
    ]);
}

?>

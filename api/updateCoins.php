<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming you are using MySQL. Adjust accordingly for your database.
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "game";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Retrieve data from the POST request and sanitize input
    $userId = $conn->real_escape_string($_POST['userId']);

    // Assuming you have a 'coins' column in your 'users' table
    $deductCoinsSql = "UPDATE users SET coins = coins - 1 WHERE id = '$userId' AND coins > 0";

    // Execute the query and handle errors
    if ($conn->query($deductCoinsSql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        $errorMessage = 'Failed to deduct coins. Error: ' . $conn->error;
        error_log($errorMessage); // Log the error
        echo json_encode(['success' => false, 'message' => $errorMessage]);
    }
    

    // Close the database connection
    $conn->close();
} else {
    // Invalid request method
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

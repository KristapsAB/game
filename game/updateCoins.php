<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Add OPTIONS
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

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

    // Check if coins have already been earned for the current game session
    $checkCoinsFlagSql = "SELECT coins_earned_flag FROM users WHERE id = '$userId'";
    $result = $conn->query($checkCoinsFlagSql);

    if ($result && $row = $result->fetch_assoc()) {
        $coinsEarnedFlag = $row['coins_earned_flag'];

        if ($coinsEarnedFlag == 0) {
            // Coins haven't been earned yet, add coins and set the flag
            $addCoinsSql = "UPDATE users SET coins = coins + 5, coins_earned_flag = 1 WHERE id = '$userId'";

            // Execute the query and handle errors
            if ($conn->query($addCoinsSql) === TRUE) {
                echo json_encode(['success' => true]);
            } else {
                $errorMessage = 'Failed to add coins. Error: ' . $conn->error;
                error_log($errorMessage); // Log the error

                // Send a more informative response to the client
                http_response_code(500); // Internal Server Error
                echo json_encode(['success' => false, 'message' => $errorMessage]);
            }
        } else {
            // Coins have already been earned, inform the client
            echo json_encode(['success' => false, 'message' => 'Coins already earned for this game session']);
        }
    } else {
        // Unable to fetch user information, inform the client
        echo json_encode(['success' => false, 'message' => 'Unable to fetch user information']);
    }

    // Close the database connection
    $conn->close();
} else {
    // Invalid request method
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

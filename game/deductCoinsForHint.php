
<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
$host = "localhost";
$user = "root";
$password = "root";
$database = "game";

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $conn->real_escape_string($_POST['userId']);

    // Deduct 1 coin from the user
    $deductCoinsSql = "UPDATE users SET coins = coins - 1 WHERE id = '$userId' AND coins > 0";

    if ($conn->query($deductCoinsSql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        $errorMessage = 'Failed to deduct coins. Error: ' . $conn->error;
        error_log($errorMessage); // Log the error

        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => $errorMessage]);
    }

    $conn->close();
} else {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

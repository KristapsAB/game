<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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

    // Retrieve user ID from the GET request
    $userId = $_GET['userId'];

    // Use prepared statement to prevent SQL injection
    $getUserCoinsSql = "SELECT coins FROM users WHERE id = ?";
    $stmt = $conn->prepare($getUserCoinsSql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($userCoins);

    if ($stmt->fetch()) {
        echo json_encode(['success' => true, 'coins' => $userCoins]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

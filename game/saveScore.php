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

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $userId = $_POST['userId'];
    $level = $_POST['level'];
    $score = $_POST['score'];

    // Insert the score directly without checking for existing scores
    $insertScoreSql = "INSERT INTO scores (userId, level, score) VALUES ('$userId', '$level', '$score')";
    if ($conn->query($insertScoreSql) !== TRUE) {
        echo json_encode(['success' => false, 'message' => $conn->error]);
        $conn->close();
        exit();
    }

    // Update user's coin balance
    $coinsEarned = $_POST['coinsEarned'];
    $updateCoinsSql = "UPDATE users SET coins = coins + $coinsEarned WHERE id = '$userId'";
    if ($conn->query($updateCoinsSql) !== TRUE) {
        echo json_encode(['success' => false, 'message' => $conn->error]);
        $conn->close();
        exit();
    }

    echo json_encode(['success' => true]);

    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

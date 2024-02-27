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

    $checkScoreSql = "SELECT * FROM scores WHERE userId = '$userId' AND level = '$level'";
    $existingScoreResult = $conn->query($checkScoreSql);

    if ($existingScoreResult->num_rows > 0) {
        $updateScoreSql = "UPDATE scores SET score = '$score' WHERE userId = '$userId' AND level = '$level'";
        if ($conn->query($updateScoreSql) !== TRUE) {
            echo json_encode(['success' => false, 'message' => $conn->error]);
            $conn->close();
            exit();
        }
    } else {
        $insertScoreSql = "INSERT INTO scores (userId, level, score) VALUES ('$userId', '$level', '$score')";
        if ($conn->query($insertScoreSql) !== TRUE) {
            echo json_encode(['success' => false, 'message' => $conn->error]);
            $conn->close();
            exit();
        }
    }

    // Check if the incoming score is better than the current best time for the level
    $checkBestTimeSql = "SELECT best_time FROM users WHERE id = '$userId' AND level = '$level'";
    $bestTimeResult = $conn->query($checkBestTimeSql);

    if ($bestTimeResult->num_rows > 0) {
        $row = $bestTimeResult->fetch_assoc();
        $currentBestTime = $row['best_time'];

        if ($currentBestTime == 0 || $score < $currentBestTime) {
            $updateBestTimeSql = "UPDATE users SET best_time = '$score' WHERE id = '$userId' AND level = '$level'";
            if ($conn->query($updateBestTimeSql) !== TRUE) {
                echo json_encode(['success' => false, 'message' => $conn->error]);
                $conn->close();
                exit();
            }
        }
    }

    echo json_encode(['success' => true]);

    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>

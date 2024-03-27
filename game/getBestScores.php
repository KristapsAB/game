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

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetch user ID from query parameters
    $userId = $_GET['userId'];

    // Query to fetch best scores for each level for the logged-in user
    $bestScoresQuery = "SELECT level, MIN(score) AS best_score FROM scores WHERE userId = '$userId' GROUP BY level";

    $bestScoresResult = $conn->query($bestScoresQuery);

    if ($bestScoresResult->num_rows > 0) {
        $bestScores = array();
        while ($row = $bestScoresResult->fetch_assoc()) {
            $bestScores[$row['level']] = $row['best_score'];
        }
        echo json_encode($bestScores);
    } else {
        // No best scores found
        echo json_encode([]);
    }

    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Add debugging statement to log the received user ID
error_log('User ID: ' . $_GET['userId']);
?>

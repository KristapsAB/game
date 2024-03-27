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

// Fetch leaderboard data from the 'scores' table
// Check if level parameter is provided
if (isset($_GET['level'])) {
    $level = $_GET['level'];
    $sql = "SELECT users.username, MIN(scores.score) as score 
            FROM scores
            INNER JOIN users ON scores.userId = users.id
            WHERE scores.level = $level
            GROUP BY users.id
            ORDER BY MIN(scores.score) ASC"; // Fetching the minimum score for each level
} else {
    $sql = "SELECT users.username, MIN(scores.score) as score 
            FROM scores
            INNER JOIN users ON scores.userId = users.id
            GROUP BY users.id
            ORDER BY MIN(scores.score) ASC"; // Fetching the overall minimum score
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data as an associative array
    $leaderboardData = array();
    while ($row = $result->fetch_assoc()) {
        $leaderboardData[] = $row;
    }

    // Return the data as JSON
    header('Content-Type: application/json');
    echo json_encode(array('success' => true, 'data' => $leaderboardData));
} else {
    // Return an error message if no data is found
    echo json_encode(array('success' => false, 'message' => 'No leaderboard data found.'));
}

// Close the connection
$conn->close();

?>

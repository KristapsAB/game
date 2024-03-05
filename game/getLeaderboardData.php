
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
$sql = "SELECT users.username, scores.score FROM scores
        INNER JOIN users ON scores.userId = users.id
        ORDER BY scores.score DESC";

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

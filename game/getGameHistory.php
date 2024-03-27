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

// Check if userId is provided in the query parameters
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    // Fetch game history data for the specified user ID from the scores table
    $sql = "SELECT * FROM scores WHERE userId = $userId";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Output data as an associative array
        $gameHistory = array();
        while ($row = $result->fetch_assoc()) {
            $gameHistory[] = $row;
        }

        // Return the data as JSON
        echo json_encode(array('success' => true, 'data' => $gameHistory));
    } else {
        // Return a message if no game history data is found for the user
        echo json_encode(array('success' => false, 'message' => 'No game history found for this user.'));
    }
} else {
    // Return an error message if userId is not provided
    echo json_encode(array('success' => false, 'message' => 'User ID is required.'));
}

// Close the connection
$conn->close();
?>

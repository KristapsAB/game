<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$username = "root";
$password = "root";
$database = "game";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
  echo json_encode(array("success" => false, "message" => "Connection failed: " . $conn->connect_error));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $requestData = json_decode(file_get_contents('php://input'), true);
  if (json_last_error() !== JSON_ERROR_NONE) {
      echo json_encode(array("success" => false, "message" => "Invalid JSON data"));
      exit;
  }

  if (isset($requestData['credential'])) {
      $credential = $requestData['credential'];

      // Decode the credential to extract user information
      $decodedCredential = base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $credential)[1])));
      $credentialData = json_decode($decodedCredential, true);
      $email = $conn->real_escape_string($credentialData['email']);
      $username = $conn->real_escape_string($credentialData['name']);
      
      // Check if the user already exists in the database
      $checkUserQuery = "SELECT id, username, email FROM users WHERE email = '$email'";
      $result = $conn->query($checkUserQuery);
      if (!$result) {
        echo json_encode(array("success" => false, "message" => "Error checking user: " . $conn->error));
        exit;
      }

      if ($result->num_rows > 0) {
        // User already exists, return their details
        $userRow = $result->fetch_assoc();
        $userId = $userRow['id'];
        echo json_encode(array("success" => true, "userId" => $userId, "username" => $userRow['username'], "email" => $userRow['email']));
      } else {
        // User does not exist, insert them into the database
        $insertUserQuery = "INSERT INTO users (username, email) VALUES ('$username', '$email')";
        if ($conn->query($insertUserQuery) === TRUE) {
          $userId = $conn->insert_id;
          echo json_encode(array("success" => true, "userId" => $userId, "username" => $username, "email" => $email));
        } else {
          echo json_encode(array("success" => false, "message" => "Error saving user to database: " . $conn->error));
        }
      }
  } else {
      echo json_encode(array("success" => false, "message" => "Missing credential data"));
  }
  exit;
}

echo json_encode(array("success" => false, "message" => "Invalid request"));
$conn->close();
?>

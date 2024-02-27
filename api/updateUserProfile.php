<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// Include your database connection file


include('classes.php');

// Check if the user ID is provided in the query parameters
if (isset($_GET['id'])) {
    $userId = $_GET['id'];

    // Retrieve JSON data from the request body
    $json_data = file_get_contents("php://input");

    // Decode JSON data
    $data = json_decode($json_data, true);

    // Check if data is provided
    if ($data && !empty($data)) {
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        // Create an instance of the User class
        $user = new User();

        $result = $user->updateUserProfile($userId, $username, $email, $password);

        if ($result) {
            // Retrieve and return updated user data
            $updatedUserData = $user->getUserDataById($userId);
            echo json_encode([
                'success' => true,
                'userData' => $updatedUserData
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update user data'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Data not provided'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'User ID not provided'
    ]);
}
?>


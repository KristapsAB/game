<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include('classes.php');

if (isset($_GET['id'])) {
    $userId = $_GET['id'];
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    if ($data && !empty($data)) {
        $username = $data['username'];
        $email = $data['email'];
        $password = isset($data['password']) ? $data['password'] : null;

        $user = new User();

        // Query the database to check if the user exists
        $userExists = $user->getUserDataById($userId) !== null;

        if ($userExists) {
            // Check if the password is provided and different from the current one
            if ($password !== null && !$user->verifyPassword($userId, $password)) {
                // Update user profile and handle password update within this method
                $result = $user->updateUserProfile($userId, $username, $email, $password);

                if ($result) {
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
                // Update user profile without changing the password
                $result = $user->updateUserProfile($userId, $username, $email);

                if ($result) {
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
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'User not found'
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

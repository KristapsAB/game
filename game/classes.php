<?php

class Database {
    private $host = "localhost"; // Your MySQL host
    private $username = "root"; // Your MySQL username
    private $password = "root"; // Your MySQL password
    private $dbname = "game"; // Your database name

    protected $conn;

    public function __construct() {
        try {
            $this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    public function getConn() {
        return $this->conn;
    }
}

class User extends Database {
    public function createUser($email, $username, $password) {
        try {
            // Validation checks
            if (!$this->validateEmail($email) || !$this->validateLatinAlphabet($username) || strlen($password) < 7) {
                return false;
            }
    
            $query = "INSERT INTO users (email, username, password) VALUES (:email, :username, :password)";
            $stmt = $this->conn->prepare($query);
    
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":username", $username);
            $stmt->bindParam(":password", $hashedPassword);
    
            $stmt->execute();
    
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    

    public function validateEmail($email) {
        // Use filter_var to validate email format
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function validateLatinAlphabet($username) {
        // Use regex to check if the username contains only Latin alphabet characters
        return preg_match('/^[a-zA-Z]+$/', $username);
    }

    public function checkUserExists($email, $username) {
        try {
            $query = "SELECT * FROM users WHERE email = :email OR username = :username";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":username", $username);

            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
    public function validateUser($email, $password) {
        try {
            $query = "SELECT * FROM users WHERE email = :email";
            $stmt = $this->conn->prepare($query);
    
            $stmt->bindParam(":email", $email);
    
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
                // Debug statement
                error_log('Stored Password: ' . $user['password']);
    
                return password_verify($password, $user['password']);
            }
    
            return false;
        } catch (PDOException $e) {
            // Log the error
            error_log('PDOException: ' . $e->getMessage());
    
            return false;
        }
    }
    
    public function getUserData($email) {
        try {
            $query = "SELECT id, username FROM users WHERE email = :email";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":email", $email);

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }

            return null;
        } catch (PDOException $e) {
            return null;
        }
    }
    public function getUserDataById($userId) {
        try {
            $query = "SELECT * FROM users WHERE id = :userId";
            $stmt = $this->conn->prepare($query);
    
            $stmt->bindParam(":userId", $userId);
    
            $stmt->execute();
    
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return null;
        }
    }
    public function getConn() {
        return parent::getConn();
    }
    public function updateUserProfile($userId, $username, $email, $password = null) {
        try {
            // Validation checks
            if (!$this->validateEmail($email) || !$this->validateLatinAlphabet($username)) {
                return false;
            }
    
            // Check if password is provided
            if ($password !== null) {
                // Password provided, update with password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $query = "UPDATE users SET username = :username, email = :email, password = :password WHERE id = :userId";
            } else {
                // Password not provided, update without password
                $query = "UPDATE users SET username = :username, email = :email WHERE id = :userId";
            }
    
            $stmt = $this->conn->prepare($query);
    
            $stmt->bindParam(":username", $username);
            $stmt->bindParam(":email", $email);
    
            // Bind password parameter if provided
            if ($password !== null) {
                $stmt->bindParam(":password", $hashedPassword);
            }
    
            $stmt->bindParam(":userId", $userId);
    
            $stmt->execute();
    
            // Add debug information
            error_log("User profile updated successfully for user ID: $userId");
    
            return true;
        } catch (PDOException $e) {
            // Log the error
            error_log('PDOException: ' . $e->getMessage());
    
            return false;
        }
    }
    
    
    
    public function updateBestTime($userId, $bestTime) {
        try {
            $query = "UPDATE users SET best_time = :bestTime WHERE id = :userId";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":bestTime", $bestTime);
            $stmt->bindParam(":userId", $userId);

            $stmt->execute();

            return true;
        } catch (PDOException $e) {
            // Log the error
            error_log('PDOException: ' . $e->getMessage());

            return false;
        }
    }
    public function verifyPassword($userId, $password) {
        try {
            $query = "SELECT password FROM users WHERE id = :userId";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":userId", $userId);

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $storedPassword = $stmt->fetchColumn();
                return password_verify($password, $storedPassword);
            }

            return false;
        } catch (PDOException $e) {
            return false;
        }
    }

    
}


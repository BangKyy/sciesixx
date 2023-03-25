<?php
require "../database/connection.php";

class AccountValidate {
    private $errorMessages = [];

    public function username($input, $emailCache): bool {
        $pattern = "/^([a-zA-Z0-9_ ]*)$/";
        $match = preg_match($pattern, $input);

        if (!$match) {
            $message = "Username hanya boleh menggunakan huruf, angka, dan underscore";
            array_push($this->errorMessages, $message);
            return false;
        }
        if (strpos($input, " ") !== false) {
            $message = "Username tidak boleh menggunakan spasi";
            array_push($this->errorMessages, $message);
            return false;
        }
        if (strlen($input) > 16) {
            $message = "Username tidak boleh lebih dari 16 karakter";
            array_push($this->errorMessages, $message);
            return false;
        }
        if (!strlen($input)) {
            $message = "Username tidak boleh kosong";
            array_push($this->errorMessages, $message);
        }

        $user = json_decode(getUserByUsername($input), true);
        if ($user) {
            if ($user["email"] === $emailCache) return true;
            $message = "Username tidak tersedia";
            array_push($this->errorMessages, $message);
            return false;
        }

        return true;
    }

    public function pushErrorMessages($input): void {
        array_push($this->errorMessages, $input);
    }

    public function getErrorMessages(): array {
        return $this->errorMessages;
    }
}

function getUsernameErrors($username, $emailCache) {
    $validate = new AccountValidate();
    $validate->username($username, $emailCache);
    $errors = $validate->getErrorMessages();
    return $errors;
}

function filterInput($value="") {
    $value = preg_replace("/([\<\>\'\-])/", "", $value);
    return $value;
}

function getUser($email) {
    global $connection;
    $email = filterInput($email);
    $sql = "SELECT * FROM users WHERE email='$email'";
    $query = $connection->query($sql);
    $result = $query->fetch_assoc();
    return json_encode($result);
}

function getUserByUsername($username) {
    global $connection;
    $username = filterInput($username);
    $sql = "SELECT * FROM users WHERE username='$username'";
    $query = $connection->query($sql);
    $result = $query->fetch_assoc();
    return json_encode($result);
}

function updateUser($email, $columnName, $newValue) {
    global $connection;
    $email = filterInput($email);
    $columnName = filterInput($columnName);
    $newValue = filterInput($newValue);
    $sql = "UPDATE users SET $columnName='$newValue' WHERE email='$email'";
    $connection->query($sql);
    return json_encode(["error" => false]);
}
?>
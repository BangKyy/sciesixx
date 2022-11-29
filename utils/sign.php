<?php
require "../database/connection.php";

class SignupError {
    private $errorMessages = [];

    public function username($input): bool {
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

        $user = getUser("username", $input);
        if (count($user)) {
            $message = "Username tidak tersedia";
            array_push($this->errorMessages, $message);
            return false;
        }

        return true;
    }

    public function email($input): bool {
        $pattern = FILTER_VALIDATE_EMAIL;
        $match = filter_var($input, $pattern);

        if (!$match) {
            $message = "Email tidak valid";
            array_push($this->errorMessages, $message);
            return false;
        }

        $user = getUser("email", $input);
        if (count($user)) {
            $message = "Email salah";
            array_push($this->errorMessages, $message);
            return false;
        }

        return true;
    }

    public function password($input): bool {
        if (strlen($input) < 8) {
            $message = "Panjang password minimal 8 karakter";
            array_push($this->errorMessages, $message);
            return false;
        }
        if (preg_match("/\s/i", $input)) {
            $message = "Password tidak bisa memiliki spasi";
            array_push($this->errorMessages, $message);
            return false;
        }
        return true;
    }

    public function cpassword($input1, $input2): bool {
        if ($input1 === $input2) return true;
        $message = "Konfirmasi password salah";
        array_push($this->errorMessages, $message);
        return false;
    }

    public function pushErrorMessages($input): void {
        array_push($this->errorMessages, $input);
    }

    public function getErrorMessages(): array {
        return $this->errorMessages;
    }
}

class LoginError {
    private $errorMessages = [];

    public function validate($email, $password): bool {
        $pattern = FILTER_VALIDATE_EMAIL;
        $isValidEmail = filter_var($email, $pattern);

        if (!$isValidEmail) {
            array_push($this->errorMessages, "Email tidak valid");
            return false;
        }

        $user = getUser("email", $email);
        if (!count($user)) {
            array_push($this->errorMessages, "Anda belum terdaftar, silahkan klik <a href=\"../signup\" class=\"text-danger\">daftar</a>");
            return false;
        }
        if ($user[0]["password"] !== $password) {
            array_push($this->errorMessages, "Password salah");
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

function getUser($key, $value) {
    global $connection;
    $key = preg_replace("/[^a-z0-9_]/i", "", $key);
    $value = preg_replace("/(\-|\/)/", "", $value);
    $value = htmlspecialchars($value);
    $query = $connection->query("SELECT * FROM users WHERE " . $key . "=" . "'$value'");
    $userData = $query->fetch_all(MYSQLI_ASSOC);
    return $userData;
}

function getSignupErrors($username, $email, $password, $cpassword) {
    $error = new SignupError();

    if (!($username && $email && $password && $cpassword)) {
        $message = "Semua wajib diisi";
        $error->pushErrorMessages($message);
    } else {
        $error->username($username);
        $error->email($email);
        $error->password($password);
        $error->cpassword($password, $cpassword);
    }

    return $error->getErrorMessages();
}

function getLoginErrors($email, $password){
    $error = new LoginError();

    if (!($email && $password)) {
        $message = "Semua wajib diisi";
        $error->pushErrorMessages($message);
    } else {
        $error->validate($email, $password);
    }

    return $error->getErrorMessages();
}

function saveUser($username, $email, $password, $date) {
    global $connection;
    $username = htmlspecialchars($username);
    $email = htmlspecialchars($email);
    $password = htmlspecialchars($password);
    $prepared = $connection->prepare("INSERT INTO users (username, email, password, date, last_activity) VALUES (?, ?, ?, ?, ?)");
    $prepared->bind_param("sssss", $username, $email, $password, $date, $date);
    $prepared->execute();
    return json_encode(["error" => false]);
}

function updateUser($column, $key, $keyValue, $value) {
    global $connection;
    $connection->query("UPDATE users SET $column = '$value' WHERE $key = '$keyValue'");
    return json_encode([
        "error" => false,
        "connection" => $connection
    ]);
}

function deleteUser($columnName, $columnValue) {
    global $connection;
    $sql = "DELETE FROM users WHERE $columnName = '$columnValue'";
    $connection->query($sql);
    return json_encode([
        "error" => false,
        "connection" => $connection
    ]);
}
?>
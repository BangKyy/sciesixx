<?php
require "../utils/sign.php";

class OTPError {
    private $errorMessages = [];

    public function email($value): bool {
        $value = strtolower($value);
        $isValidEmail = filter_var($value, FILTER_VALIDATE_EMAIL);

        if (!$isValidEmail) {
            array_push($this->errorMessages, "Email tidak valid");
            return false;
        }
        $userData = getUser("email", $value);

        if (!$userData) {
            array_push($this->errorMessages, "Email salah atau mungkin belum terdaftar");
            return false;
        }

        return true;
    }

    public function otp($value): bool {
        $userData = getOtpUser("otp_number", $value);

        if (!$userData) {
            array_push($this->errorMessages, "Kode verifikasi salah");
            return false;
        }
        return true;
    }

    public function getErrorMessages(){
        return $this->errorMessages;
    }
}

function getOtpEmailErrors($email) {
    $error = new OTPError();
    $error->email($email);
    return $error->getErrorMessages();
}

function getOtpUser($column, $columnValue) {
    global $connection;
    $sql = "SELECT * FROM otp WHERE $column = '$columnValue'";
    $query = $connection->query($sql);
    $result = $query->fetch_assoc();
    return $result;
}

function saveOtpUser($email, $otp, $expire, $date) {
    global $connection;
    $sql = "INSERT INTO otp (email, otp_number, expire_date, date) VALUES (?, ?, ?, ?)";
    $prepared = $connection->prepare($sql);
    $prepared->bind_param("ssss", $email, $otp, $expire, $date);
    $prepared->execute();
    return json_encode(["error" => false]);
}

function deleteOtpUser($column, $columnValue) {
    global $connection;
    $sql = "DELETE FROM otp WHERE $column = '$columnValue'";
    $connection->query($sql);
    return json_encode(["error" => true]);
}
?>
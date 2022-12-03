<?php
require "../utils/sign.php";
require "../utils/formatter.php";

class OTPError {
    private $errorMessages = [];

    public function email($value): bool {
        $value = strtolower($value);
        $value = trim($value);
        $isValidEmail = filter_var($value, FILTER_VALIDATE_EMAIL);

        if (!$value) {
            array_push($this->errorMessages, "Email wajib diisi");
            return false;
        }
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
    $sql = "SELECT * FROM otp WHERE $column LIKE '$columnValue'";
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

function updateOtpUser($id, $entries) {
    global $connection;
    $implodedEntries = implodeAssoc($entries, ", ", "=", true);
    $sql = "UPDATE otp SET $implodedEntries WHERE id = $id";
    $connection->query($sql);
    return json_encode(["error" => false]);
}

function deleteOtpUser($column, $columnValue) {
    global $connection;
    $column = strtolower($column);
    $columnValue = strtolower($columnValue);
    $sql = "DELETE FROM otp WHERE $column LIKE '$columnValue'";
    $connection->query($sql);
    return json_encode(["error" => false]);
}

function deleteExpiredOtpUser($dateNow) {
    global $connection;
    $dateNow = $dateNow;
    $selectedQuery = $connection->query("SELECT expire_date FROM otp");
    $selected = $selectedQuery->fetch_all(MYSQLI_ASSOC);
    $filteredExpires = array_filter($selected, function($var) {
        global $dateNow;
        return intval($var["expire_date"]) < intval($dateNow);
    });
    $expireDates = array_map(function($var) {
        return "'" . $var["expire_date"] . "'";
    }, $filteredExpires);
    $implodedExpireDates = implode(", ", $expireDates);
    $sql = "DELETE FROM otp WHERE expire_date IN ($implodedExpireDates)";
    $connection->query($sql);
    return json_encode(["error" => false]);
}
?>
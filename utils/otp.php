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
        $value = trim($value);

        if (!$value) {
            array_push($this->errorMessages, "Kode verifikasi wajib diisi");
            return false;
        }

        $userData = getOtpUser("otp_number", $value);
        if (!$userData) {
            array_push($this->errorMessages, "Kode verifikasi salah");
            return false;
        }
        return true;
    }

    public function password($email, $password, $cpassword): bool {
        $email = trim($email);
        $password = trim($password);
        $cpassword = trim($cpassword);
        
        if (!$email) {
            array_push($this->errorMessages, "Halaman ini telah kadaluwarsa");
            return false;
        }

        $user = getUser("email", $email);
        $oldPassword =  $user["password"];
        $isEqualOldPassword = ($oldPassword === $password) && ($oldPassword === $cpassword);
        $legalMatch = "/^([a-zA-Z0-9_ ]*)$/";
        $isLegalCharacter = preg_match($legalMatch, $password) && preg_match($legalMatch, $cpassword);

        if (!($password && $cpassword)) {
            array_push($this->errorMessages, "Semua kolom wajib diisi");
            return false;
        }
        if (!$isLegalCharacter) {
            array_push($this->errorMessages, "Password hanya boleh menggunakan huruf, angka, dan underscore");
            return false;
        }
        if (preg_match("/\s/", $password) || preg_match("/\s/", $cpassword)) {
            array_push($this->errorMessages, "Password tidak boleh menggunakan spasi");
            return false;
        }
        if ($password !== $cpassword) {
            array_push($this->errorMessages, "Konfirmasi password harus sama dengan password");
            return false;
        }
        if (!(strlen($password) >= 8 && strlen($cpassword) >= 8)) {
            array_push($this->errorMessages, "Password minimal 8 karakter");
            return false;
        }
        if ($isEqualOldPassword) {
            array_push($this->errorMessages, "Password baru tidak boleh sama dengan password lama");
            return false;
        }
        return true;
    }

    public function validateUser($email, $otp): bool {
        if (!$email) {
            array_push($this->errorMessages, "Kode verifikasi anda telah kadaluwarsa");
            return false;
        }

        $user = getOtpUser("email", $email);

        if (!$user) {
            array_push($this->errorMessages, "Email salah");
            return false;
        }
        if ($user["otp_number"] !== "$otp") {
            array_push($this->errorMessages, "Kode verifikasi salah");
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

function getOtpNumberErrors($otp) {
    $error = new OTPError();
    $error->otp($otp);
    return $error->getErrorMessages();
}

function getOTPUserErrors($email, $otp) {
    $error = new OTPError();
    $error->validateUser($email, $otp);
    return $error->getErrorMessages();
}

function getOtpPasswordErrors($email, $password, $cpassword) {
    $error = new OTPError();
    $error->password($email, $password, $cpassword);
    return $error->getErrorMessages();
}

function getOtpUser($column, $columnValue, $all=false) {
    global $connection;
    $sql = "SELECT * FROM otp WHERE $column LIKE '$columnValue'";
    $query = $connection->query($sql);
    $result = $all ? $query->fetch_all(MYSQLI_ASSOC) : $query->fetch_assoc();
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

function resetOtpTableId() {
    global $connection;
    $query = $connection->query("SELECT id FROM otp");
    $result = $query->fetch_all(MYSQLI_ASSOC);

    if (count($result) !== 0) {
        return json_encode(["error" => false]);
    }

    $connection->query("ALTER TABLE otp AUTO_INCREMENT=1");
    return json_encode(["error" => false]);
}

function deleteExpiredOtpUser($dateNow) {
    global $connection;
    $dateNow = $dateNow;
    $selectedQuery = $connection->query("SELECT expire_date FROM otp");
    $selected = $selectedQuery->fetch_all(MYSQLI_ASSOC);

    if (!count($selected)) {
        return json_encode(["error" => false]);
    }

    $filteredExpires = array_filter($selected, function($var) {
        global $dateNow;
        return intval($var["expire_date"]) < intval($dateNow);
    });
    $expireDates = array_map(function($var) {
        return "'" . $var["expire_date"] . "'";
    }, $filteredExpires);
    $implodedExpireDates = implode(", ", $expireDates);

    if (!$implodedExpireDates) {
        return json_encode(["error" => false]);
    }
    
    $sql = "DELETE FROM otp WHERE expire_date IN ($implodedExpireDates)";
    $connection->query($sql);
    return json_encode(["error" => false]);
}
?>
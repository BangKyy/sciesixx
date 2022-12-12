<?php
require "../utils/mailer.php";
require "../utils/otp.php";

header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);

function getRequest($key, $request) {
    $value = key_exists($key, $request) ? $request[$key] : "";
    $value = preg_replace("/[\<\>]/", "", $value);
    return $value;
}

switch($_SERVER["REQUEST_METHOD"]) {
    case "GET": {
        echo json_encode(["error" => true]);
        break;
    }
    case "POST": {
        $email = getRequest("email", $POST);
        $otpUser = getOtpUser("email", $email);
        $body = "<h1>" . $otpUser["otp_number"] . "</h1><br><br><p>(Berlaku selama 15 menit)</p>";
        echo sendMail($email, "Kode Verifikasi", $body);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
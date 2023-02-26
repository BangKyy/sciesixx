<?php
require "../utils/mailer.php";
require "../utils/otp.php";
require "../utils/opt-mailer.php";

header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);

function getRequest($key, $request) {
    $value = key_exists($key, $request) ? $request[$key] : "";
    $value = preg_replace("/[\<\>]/", "", $value);
    return $value;
}

// function getMailMessageBody() {
//     $filePath = "../html-data/otp/new-password.txt";
//     $file = fopen($filePath, "r");
//     $messageBody = fread($file, filesize($filePath));
//     return $messageBody;
// }

switch($_SERVER["REQUEST_METHOD"]) {
    case "GET": {
        echo json_encode(["error" =>true]);
        // echo json_encode(["data" => getMailMessageBody("123456")]);
        break;
    }
    case "POST": {
        $email = getRequest("email", $POST);
        $otpUser = getOtpUser("email", $email);
        // $body = "<h1>" . $otpUser["otp_number"] . "</h1><br><br><p>(Berlaku selama 15 menit)</p>";
        $body = getMailMessageBody($otpUser["otp_number"]);
        echo sendMail($email, "Kode Verifikasi", $body);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
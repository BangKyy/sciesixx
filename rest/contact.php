<?php
require "../utils/mailer.php";
require "../utils/contact.php";

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
        $mailConfig = getMailConfig();
        $from = $mailConfig->email;
        $name = getRequest("name", $POST);
        $email = getRequest("email", $POST);
        $message = getRequest("message", $POST);
        $date = getRequest("date", $POST);
        $subject = "Welcome";
        $body = "<h1>Hai " . $name . "!</h1>";
        $selfBody = "<pre><p>$message</p></pre>";

        saveContactForm($name, $email, $message, $date);
        sendMail($email, $subject, $body);
        echo sendMail($from, "Pesan dari: $email", $selfBody);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
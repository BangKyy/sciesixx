<?php
require "../utils/sign.php";
require "../utils/mailer.php";
header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);
$reqMethod = $_SERVER["REQUEST_METHOD"];

if ($reqMethod === "GET") {
    $collumnName = $_GET["key"];
    $collumnValue = $_GET["value"];
    $user = getUser($collumnName, $collumnValue);
    echo json_encode($user);
} 
elseif ($reqMethod === "POST") {
    $username = key_exists("username", $POST) ? $POST["username"] : "";
    $email = key_exists("email" ,$POST) ? $POST["email"] : "";
    $password = key_exists("password", $POST) ? $POST["password"] : "";
    $cpassword = key_exists("cpassword", $POST) ? $POST["cpassword"] : "";
    $date = $POST["date"];
    $errorMessages = getSignupErrors($username, $email, $password, $cpassword);
    $output = [
        "success" => !count($errorMessages),
        "error" => count($errorMessages) > 0,
        "errorMessages" => $errorMessages
    ];
    $mailSubject = "Selamat Datang di Situs Kami!";
    $mailBody = "<p>Selamat datang $username!</p><br><br>Terima kasih telah bergabung bersama kami!";

    if (!$output["error"]) {
        saveUser($username, $email, $password, $date);
        sendMail($email, $mailSubject, $mailBody);
    }

    echo json_encode($output);
}
else {
    echo json_encode(["error" => true]);
}
?>
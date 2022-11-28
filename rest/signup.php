<?php
require "../utils/sign.php";
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
    $isSuccess = !count($errorMessages);
    $userData = ["" => ""];

    if ($isSuccess) {
        saveUser($username, $email, $password, $date);
        $userData = getUser("email", $email);
    }

    $output = [
        "success" => $isSuccess,
        "error" => !$isSuccess,
        "errorMessages" => $errorMessages,
        "userData" => $userData
    ];

    echo json_encode($output);
}
else {
    echo json_encode(["error" => true]);
}
?>
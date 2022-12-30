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
    $email = key_exists("email" ,$POST) ? $POST["email"] : "";
    $password = key_exists("password", $POST) ? $POST["password"] : "";
    $date = key_exists("date", $POST) ? $POST["date"] : "";
    $errorMessages = getLoginErrors($email, $password);
    $output = [
        "success" => !count($errorMessages),
        "error" => count($errorMessages) > 0,
        "errorMessages" => $errorMessages,
        "user" => null
    ];

    if ($output["success"]) {
        updateUser("last_activity", "email", $email, $date);
        $output["user"] = getUser("email", $email);
    }

    echo json_encode($output);
}
else {
    echo json_encode(["error" => true]);
}
?>
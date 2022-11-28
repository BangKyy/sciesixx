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
    $isSuccess = !count($errorMessages);
    $userData = ["" => ""];

    if ($isSuccess) {
        $userData = getUser("email", $email);
        updateUser($userData["id"], "last_activity", $date);
        $userData["last_activity"] = $date;
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
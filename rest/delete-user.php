<?php
require "../utils/sign.php";
header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);

switch($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        $email = key_exists("email", $POST) ? $POST["email"] : "";
        echo deleteUser("email", $email);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
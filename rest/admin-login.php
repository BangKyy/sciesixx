<?php
require "../utils/admin-login.php";

header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);

function getRequest($key, $request) {
    $value = key_exists($key, $request) ? $request[$key] : "";
    $value = preg_replace("/[\<\>]/", "", $value);
    return $value;
}

switch($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        $email = getRequest("email", $POST);
        $password = getRequest("password", $POST);
        $lastActivity = getRequest("last_activity", $POST);
        if (!checkUserAdmin($email, $password)) {
            echo json_encode(["error" => true]);
            break;
        }
        echo updateUserAdminActivity($email, $lastActivity);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
<?php
require "../utils/account.php";

header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);
$reqMethod = $_SERVER["REQUEST_METHOD"];

function getRequest($key, $request) {
    $value = key_exists($key, $request) ? $request[$key] : "";
    $value = preg_replace("/[\<\>]/", "", $value);
    return $value;
}

switch($reqMethod) {
    case "GET": {
        $email = getRequest("email", $_GET);
        echo getUser($email);
        break;
    }
    case "POST": {
        $email = getRequest("email", $POST);
        $columnName = getRequest("key", $POST);
        $newValue = getRequest("value", $POST);
        echo updateUser($email, $columnName, $newValue);
        break;
    }
    case "PATCH": {
        $username = getRequest("username", $POST);
        $emailCache = getRequest("email_cache", $POST);
        $usernameErrors = getUsernameErrors($username, $emailCache);
        $output = [
            "error" => false,
            "errorMessages" => []
        ];
        if (!!count($usernameErrors)) {
            $output["error"] = true;
            $output["errorMessages"] = $usernameErrors;
        }
        echo json_encode($output);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
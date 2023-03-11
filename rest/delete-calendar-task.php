<?php
require "../utils/calendar-task.php";

header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);

function getRequest($key, $request) {
    $value = key_exists($key, $request) ? $request[$key] : "";
    $value = preg_replace("/[\<\>]/", "", $value);
    return $value;
}

switch($_SERVER["REQUEST_METHOD"]) {
    case "POST": {
        $key = getRequest("key", $POST);
        $value = getRequest("value", $POST);
        echo deleteTask($key, $value);
        break;
    }
    default: {
        echo json_encode(["error" => true]);
    }
}
?>
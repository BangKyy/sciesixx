<?php
require "../utils/calendar-task.php";

header("Content-Type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);

function getRequest($key, $request)
{
    $value = key_exists($key, $request) ? $request[$key] : "";
    $value = preg_replace("/[\<\>]/", "", $value);
    return $value;
}

try {
    switch ($_SERVER["REQUEST_METHOD"]) {
        case "GET": {
                $key = getRequest("key", $POST ? $POST : $_GET);
                $value = getRequest("value", $POST ? $POST : $_GET);
                echo getTasks($key, $value);
                break;
            }
        case "POST": {
                $name = getRequest("name", $POST);
                $description = getRequest("description", $POST);
                $tag = getRequest("tag", $POST);
                $date = getRequest("date", $POST);
                echo saveTask($name, $description, $tag, $date);
                break;
            }
        case "PATCH": {
                $name = getRequest("name", $POST);
                $description = getRequest("description", $POST);
                $tag = getRequest("tag", $POST);
                $date = getRequest("date", $POST);
                echo updateTask($name, $description, $tag, $date);
                break;
            }
        default: {
                echo json_encode(["error" => true]);
            }
    }
} catch (Exception $e) {
    echo json_encode(["error" => true, "errorMessage" => $e->getMessage()]);
}

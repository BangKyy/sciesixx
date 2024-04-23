<?php
require "../utils/teacher-login.php";
require "../utils/exception.php";

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
        case "POST": {
                $code = getRequest("code", $POST);
                echo validateCode($code);
                break;
            }
        default: {
                echo json_encode(["error" => true]);
            }
    }
} catch (Exception $e) {
    echo json_encode(["error" => true, "errorMessage" => $e->getMessage()]);
}

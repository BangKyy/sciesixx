<?php
require "../utils/student.php";

$POST = json_decode(file_get_contents("php://input"), true);
$reqMethod = $_SERVER["REQUEST_METHOD"];

function getData($method, $key, $default = "")
{
    return key_exists($key, $method) ? $method[$key] : $default;
}

try {
    switch ($reqMethod) {
        case "GET": {
                $key = getData($_GET, "key");
                $value = getData($_GET, "value");
                $output = getStudents($key, $value);

                echo json_encode($output);
                break;
            }
        default: {
                echo json_encode(["error" => true]);
            }
    }
} catch (Exception $e) {
    echo json_encode(["error" => true, "errorMessage" => $e->getMessage()]);
}

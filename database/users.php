<?php
require "./connection.php";
header("Content-type: application/json; charset=utf-8");

$POST = json_decode(file_get_contents("php://input"), true);
$reqMethod = $_SERVER["REQUEST_METHOD"];

function getUser() {
    global $connection;
    $key = preg_replace("/[^a-z0-9_]/i", "", $_GET["key"]);
    $value = htmlspecialchars($_GET["value"]); // <-- Not secure
    $query = $connection->query("SELECT * FROM users WHERE " . $key . "=" . "'$value'");
    $userData = $query->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($userData);
}

function saveUser() {
    global $connection, $POST;
    $username = htmlspecialchars($POST["username"]);
    $email = htmlspecialchars($POST["email"]);
    $password = htmlspecialchars($POST["password"]);
    $date = $POST["date"];
    $prepared = $connection->prepare("INSERT INTO users (username, email, password, date) VALUES (?, ?, ?, ?)");
    $prepared->bind_param("ssss", $username, $email, $password, $date);
    $prepared->execute();

    echo json_encode(["error" => false]);
}

if ($reqMethod === "GET") {
    getUser();
} elseif ($reqMethod === "POST") {
    saveUser();
} else {
    echo json_encode(["error" => true]);
}
?>
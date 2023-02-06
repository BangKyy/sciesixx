<?php
require "../database/connection.php";

function getTasks() {
    global $connection;
    $query = $connection->query("SELECT * FROM calendar_tasks");
    $result = $query->fetch_all(MYSQLI_ASSOC);
    return json_encode($result);
}

function saveTask($name, $description, $date) {
    global $connection;
    $prepared = $connection->prepare("INSERT INTO calendar_tasks (name, description, date) VALUES (?, ?, ?)");
    $prepared->bind_param("sss", $name, $description, $date);
    $prepared->execute();
    echo json_encode(["error" => false]);
}
?>
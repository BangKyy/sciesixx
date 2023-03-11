<?php
require "../database/connection.php";

function filterInput($value="") {
    $value = preg_replace("/([\<\>\'\-])/", "", $value);
    return $value;
}

function getTasks() {
    global $connection;
    $query = $connection->query("SELECT * FROM calendar_tasks");
    $result = $query->fetch_all(MYSQLI_ASSOC);
    return json_encode($result);
}

function saveTask($name, $description, $tag, $date) {
    global $connection;
    $prepared = $connection->prepare("INSERT INTO calendar_tasks (name, description, tag, date) VALUES (?, ?, ?, ?)");
    $prepared->bind_param("ssss", $name, $description, $tag, $date);
    $prepared->execute();
    echo json_encode(["error" => false]);
}

function deleteTask($key, $value) {
    global $connection;
    $key = filterInput($key);
    $value = filterInput($value);
    $connection->query("DELETE FROM calendar_tasks WHERE $key='$value'");
    return json_encode(["error" => false]);
}
?>
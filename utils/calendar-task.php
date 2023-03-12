<?php
require "../database/connection.php";

function filterInput($value="") {
    $value = preg_replace("/([\<\>\'\-])/", "", $value);
    return $value;
}

function getTasks($key="", $value="") {
    global $connection;
    $key = filterInput($key);
    $value = filterInput($value);
    $sql = "SELECT * FROM calendar_tasks";
    $isSpecified = boolval($key && $value);
    $sql .= $isSpecified ? " WHERE $key='$value'" : "";
    $query = $connection->query($sql);
    $result = $isSpecified ? $query->fetch_assoc() : $query->fetch_all(MYSQLI_ASSOC);
    return json_encode($result);
}

function saveTask($name, $description, $tag, $date) {
    global $connection;
    $prepared = $connection->prepare("INSERT INTO calendar_tasks (name, description, tag, date) VALUES (?, ?, ?, ?)");
    $prepared->bind_param("ssss", $name, $description, $tag, $date);
    $prepared->execute();
    return json_encode(["error" => false]);
}

function updateTask($name, $description, $tag, $date) {
    global $connection;
    $name = filterInput($name);
    $description = filterInput($description);
    $tag = filterInput($tag);
    $date = filterInput($date);
    $sql = "UPDATE calendar_tasks SET name='$name', description='$description', tag='$tag', date='$date' WHERE tag='$tag'";
    $connection->query($sql);
    return json_encode(["error" => false]);
}

function deleteTask($key, $value) {
    global $connection;
    $key = filterInput($key);
    $value = filterInput($value);
    $connection->query("DELETE FROM calendar_tasks WHERE $key='$value'");
    return json_encode(["error" => false]);
}
?>
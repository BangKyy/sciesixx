<?php
require "../database/connection.php";

function saveContactForm($name, $email, $message, $date) {
    global $connection;
    $prepared = $connection->prepare("INSERT INTO contact (name, email, message, date) VALUES (?, ?, ?, ?)");
    $prepared->bind_param("ssss", $name, $email, $message, $date);
    $prepared->execute();
    return json_encode(["error" => false]);
}
?>
<?php
require "../database/connection.php";

function getImageCounts() {
    global $connection;
    $query = $connection->query("SELECT * FROM practice_images");
    $data = $query->fetch_all(MYSQLI_ASSOC);
    return json_encode($data);
}
?>
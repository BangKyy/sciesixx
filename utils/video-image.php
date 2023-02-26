<?php
require "../database/connection.php";

function getVideoCounts() {
    global $connection;
    $query = $connection->query("SELECT * FROM video_images");
    $result = $query->fetch_all(MYSQLI_ASSOC);
    return json_encode($result);
}
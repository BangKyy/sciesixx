<?php
require "../database/connection.php";

function searchStudents($key, $value) {
    global $connection;

    $sql = "SELECT * FROM students WHERE $key LIKE '%$value%'";
    $query = $connection->query($sql);
    $result = $query->fetch_all(MYSQLI_ASSOC);
    return $result;
}
?>
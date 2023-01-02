<?php
require "../database/connection.php";

function getStudents($key="", $value="") {
    global $connection;

    $sql = "SELECT * FROM students";
    $isFilled = $key && $value;

    if ($isFilled) {
        $key = preg_replace("/[\<\>]/", "", $key);
        $value = preg_replace("/[\<\>]/", "", $value);
        $sql .= " WHERE $key LIKE $value";
    }

    $query = $connection->query($sql);
    $result = $isFilled ? $query->fetch_assoc() : $query->fetch_all(MYSQLI_ASSOC);
    return $result;
}
?>
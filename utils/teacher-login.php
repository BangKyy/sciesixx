<?php
require "../database/connection.php";

function getCodes($code="", $all=true) {
    global $connection;
    $code = preg_replace("/([^a-zA-Z0-9])/", "", $code);
    $sql = "SELECT * FROM teacher_users";
    $sql .= $code ? " WHERE code='$code'" : "";
    $query = $connection->query($sql);
    $result = $all ? $query->fetch_all(MYSQLI_ASSOC) : $query->fetch_assoc();
    return $result;
}

function validateCode($code) {
    $codes = getCodes($code);
    $isValidCode = in_array($code, array_map(function($c) {
        return $c["code"];
    }, $codes));
    $output = [
        "error" => !$isValidCode,
        "data" => null
    ];
    
    if ($isValidCode) {
        $output["data"] = getCodes($code, false);
    }

    return json_encode($output);
}
?>
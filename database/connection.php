<?php
function getConfig() {
    $filePath = "../json/connection.json";
    $file = fopen($filePath, "r");
    $rawData = fread($file, filesize($filePath));
    fclose($file);
    $data = json_decode($rawData, false);
    return $data;
}

$config = getConfig();
$connection = new mysqli($config->hostname, $config->username, $config->password, $config->database);
$connectionError = false;

$connection->connect_error === "" ? $connectionError = true : 0;
?>
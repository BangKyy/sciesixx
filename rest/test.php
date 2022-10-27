<?php
header("Content-Type: application/json; charset=utf-8");
$data = $_GET["message"];
echo json_encode(["$data"]);
?>
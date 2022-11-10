<?php
require "../../utils/signup.php";

if ($reqMethod === "GET") {
    getUser();
} elseif ($reqMethod === "POST") {
    saveUser();
} else {
    echo json_encode(["error" => true]);
}
?>
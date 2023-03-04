<?php
require "../database/connection.php";

function filterInput($value) {
    $value = preg_replace("/([\/\'\-])/", "", $value);
    $value = preg_replace("/(\<)/", "&lt;", $value);
    $value = preg_replace("/(\>)/", "&gt;", $value);
    return $value;
}

function saveUserAdmin($email, $password, $lastActivity) {
    global $connection;
    $prepared = $connection->prepare("INSERT INTO admin_users (email, password, last_activity) VALUES (?, ?, ?)");
    $prepared->bind_param("sss", $email, $password, $lastActivity);
    $prepared->execute();
    return json_encode(["error" => false]);
}

function updateUserAdminActivity($email, $lastActivity) {
    global $connection;
    $email = filterInput($email);
    $prepared = $connection->prepare("UPDATE admin_users SET last_activity='$lastActivity' WHERE email='$email'");
    $prepared->execute();
    echo json_encode(["error" => false]);
}

function getUserAdmin($email="", $all=true) {
    global $connection;
    $email = filterInput($email);
    $sql = !!strlen($email) ? "SELECT * FROM admin_users WHERE email='$email'" : "SELECT * FROM admin_users";
    $query = $connection->query($sql);
    $result = $all ? $query->fetch_all(MYSQLI_ASSOC) : $query->fetch_assoc();
    return $result;
}

function userExists($email) {
    $signedUser = getUserAdmin($email);
    $output = !!count($signedUser);
    return $output;
}

function correctUser($email, $password) {
    $userIsExists = userExists($email);
    if (!$userIsExists) return false;
    $signedUser = getUserAdmin($email, false);
    $output = $password === $signedUser["password"];
    return $output;
}

function checkUserAdmin($email, $password) {
    $isCorrectUser = correctUser($email, $password);
    return $isCorrectUser;
}
?>
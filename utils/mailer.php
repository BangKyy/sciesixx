<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "../lib/phpmailer/src/PHPMailer.php";
require "../lib/phpmailer/src/Exception.php";
require "../lib/phpmailer/src/SMTP.php";

function getMailConfig() {
    $path = "../env-json/phpmailer.json";
    $file = fopen($path, "r");
    $data = fread($file, filesize($path));
    fclose($file);
    return json_decode($data, false);
}

function sendMail($to, $subject, $body) {
    $mailConfig = getMailConfig();
    $from = $mailConfig->email;
    $password = $mailConfig->password;

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = $from;
    $mail->Password = $password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom($from);
    $mail->addAddress($to);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->send();

    return json_encode(["error" => false]);
}
?>
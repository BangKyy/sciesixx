<?php
function getMailMessageBody($otp) {
    $messageBody = "<div class='header'><h1 style='text-align:center' class='h1-site-name'><a style='text-decoration:none;color:initial' href='https://sciesixx.com' class='site-name a-site-name'>SCIESIXX</a></h1></div><div class='message'><h3 style='text-align:center' class='otp-top-text'>Kode verifikasi</h3><h2 style='text-align:center' class='otp-number'>$otp</h2><p style='text-align: center;'>Mohon untuk tidak membagikan kode OTP ini ke siapapun</p><p style='text-align:center' class='otp-bottom-text'>Berlaku selama 15 menit</p><p style='text-align:center' class='otp-footer-text'>&copy; 2022 sciesixx</p></div>";
    return $messageBody;
}
?>
import { getCookie, setCookie } from "./lib/cookie.js";

const sendMailOtp = async (email) => {
    const payload = { email };
    const rawData = await fetch("../../../rest/otp-mailer.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await rawData.json();
    return data;
};

const resendEmail = async () => {
    const email = getCookie(document, { name: "otp_user" }) || "";
    const resendDate = parseInt(getCookie(document, { name: "otp_resend_time" }));

    if (!(email && resendDate)) return window.location.assign("../");
    if (Date.now() < resendDate) return window.location.assign("../");

    await sendMailOtp(email);
    setCookie(document, {
        name: "otp_resend_time",
        value: `${Date.now() + (1000 * 60)}`,
        expires: 1000 * 60 * 15
    });

    window.location.assign("../");
};

window.addEventListener("load", () => {
    resendEmail();
});
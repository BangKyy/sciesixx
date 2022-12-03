import { deleteCookie, getCookie, setCookie } from "./lib/cookie.js";
import { getOtp } from "./lib/otp.js";

const form = document.querySelector(".form");
const successAlert = document.querySelector(".success-alert");
const errorAlert = document.querySelector(".error-alert");

const showErrors = (error) => {
    const container = document.querySelector(".error-alert");
    alert(error);
};

const getOtpUser = async (key, value) => {
    const rawData = await fetch(`../../rest/otp-email.php?key=${key}&value=${value}`);
    const data = await rawData.json();
    return data;
};

const deleteOtpUser = async (key, value) => {
    const payload = { key, value };
    const rawData = await fetch("../../rest/otp-email.php", {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await rawData.json();
    return data;
};
 
const deleteExpiredOtpUser = async () => {
    const payload = { date: Date.now() };
    const rawData = await fetch("../../rest/otp-email.php", {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await rawData.json();
    return data;
};

const sendOtpEmail = async (email, otp, expire, date=Date()) => {
    const payload = { email, otp, expire, date };
    const rawData = await fetch("../../rest/otp-email.php", {
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

const submitForm = async () => {
    const expireDate = new Date();
    expireDate.setTime(Date.now() + (1000 * 60 * 15));
    const email = document.querySelector("#email-input")?.value;
    const otp = getOtp(6);
    const expire = expireDate.getTime();
    const resData = await sendOtpEmail(email, otp, expire);

    if (!resData?.success) {
        showErrors(resData.errorMessages);
        return;
    }

    setCookie(document, {
        name: "otp_user",
        value: email,
        expires: 1000 * 60 * 15
    });

    window.location.reload();
};

const toOtpMode = () => {
    console.log("work");
};

const checkOtpMode = async (callback) => {
    const otpUserCookie = getCookie(document, { name: "otp_user" });
    const otpUser = await getOtpUser("email", otpUserCookie || "") || "";
    const expireDate = new Date(parseInt(otpUser?.expire_date || 0));
    if (!(otpUser && (Date.now() < expireDate))) {
        await deleteExpiredOtpUser();
        deleteCookie(document, { name: "otp_user" });
        return;
    };
    callback();
};

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    submitForm();
});

window.addEventListener("load", () => {
    checkOtpMode(() => {
        toOtpMode();
    });
});
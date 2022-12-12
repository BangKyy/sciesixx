import { deleteCookie, getCookie, setCookie } from "./lib/cookie.js";
import { getOtp } from "./lib/otp.js";

const formEmail = document.querySelector(".form-1");
const formOtp = document.querySelector(".form-2");
const formPassword = document.querySelector(".form-3");

const showErrors = (error) => {
    const container = document.querySelector(".error-alert-container");
    const element = `
        <div class="error-alert alert alert-warning alert-dismissible fade show text-center" role="alert">
            ${error}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    container.innerHTML = element;
};

const showLoader = (event) => {

};

const hideLoader = (event) => {

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

const sendOtpNumber = async (email, otp, expire) => {
    const payload = { email, otp, expire };
    const rawData = await fetch("../../rest/otp-number.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await rawData.json();
    return data;
}

const sendOtpPassword = async (email, password, cpassword, date=Date()) => {
    const payload = { email, password, cpassword, date };
    const rawData = await fetch("../../rest/otp-password.php", {
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

const sendMailOtp = async (email) => {
    const payload = { email };
    const rawData = await fetch("../../rest/otp-mailer.php", {
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

const submitEmailForm = async () => {
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

    await sendMailOtp(email);
    setCookie(document, {
        name: "otp_user",
        value: email,
        expires: 1000 * 60 * 15
    });
    
    window.location.reload();
};

const submitOtpForm = async () => {
    const expireDate = new Date();
    expireDate.setTime(Date.now() + (1000 * 60 * 30));
    const email = getCookie(document, { name: "otp_user" });
    const otp = document.querySelector("#otp-input")?.value;
    const expire = expireDate.getTime();
    const resData = await sendOtpNumber(email, otp, expire);

    if (!resData?.success) {
        showErrors(resData.errorMessages);
        return;
    }

    setCookie(document, {
        name: "otp_number",
        value: otp,
        expires: 1000 * 60 * 30
    });
    
    window.location.reload();
};

const submitPasswordForm = async () => {
    const email = getCookie(document, { name: "otp_user" });
    const password = document.querySelector("#password-input")?.value;
    const cpassword = document.querySelector("#cpassword-input")?.value;

    const resData = await sendOtpPassword(email, password, cpassword);

    if (!resData?.success) {
        showErrors(resData.errorMessages);
        return;
    }

    deleteCookie(document, { name: "otp_user" });
    deleteCookie(document, { name: "otp_number" });
    setCookie(document, {
        name: "user",
        value: email,
        expires: 1000 * 60 * 60
    });

    window.location.assign("../../");
};

const changeForm = (formNumber) => {
    const forms = [
        document.querySelector(".form-1"),
        document.querySelector(".form-2"),
        document.querySelector(".form-3")
    ];
    const submitBtns = document.querySelectorAll(".submit-btn");

    forms.forEach((form, i) => {
        if (i === formNumber - 1) {
            form.classList.remove("form-hidden");
        } else {
            form.classList.add("form-hidden");
        }
    });
};

const toEmailMode = () => {
    changeForm(1);
};

const toOtpMode = (email) => {
    // const otpCode = getCookie(document, { name: "otp_code" });
    changeForm(2);
    // console.log("OTP code: %s", otpCode);
};

const toPasswordMode = (otp) => {
    const title = document.querySelector(".verify-title-container h4");
    title.innerHTML = "Password Baru";
    changeForm(3);
};

const checkMode = async (callbackEmail, callbackOtp, callbackPassword) => {
    const otpUserCookie = getCookie(document, { name: "otp_user" });
    const otpNumber = getCookie(document, { name: "otp_number" });
    const otpUser = await getOtpUser("email", otpUserCookie || "") || "";
    const expireDate = new Date(parseInt(otpUser?.expire_date || 0));
    const formSpinner = document.querySelector(".form-spinner");

    if (otpNumber) {
        callbackPassword(otpUser.otp_number);
        formSpinner.style.display = "none";
        return;
    }
    if (otpUser && (Date.now() < expireDate)) {
        callbackOtp(otpUser.email);
        formSpinner.style.display = "none";
        return;
    };
    
    console.log(await deleteExpiredOtpUser());
    deleteCookie(document, { name: "otp_user" });
    formSpinner.style.display = "none";
    callbackEmail();
};

formEmail.addEventListener("submit", (ev) => {
    ev.preventDefault();
    submitEmailForm();
});
formOtp.addEventListener("submit", (ev) => {
    ev.preventDefault();
    submitOtpForm();
});
formPassword.addEventListener("submit", (ev) => {
    ev.preventDefault();
    submitPasswordForm();
});

window.addEventListener("load", () => {
    checkMode(() => {
        toEmailMode();
    }, (otpEmail) => {
        toOtpMode(otpEmail);
    }, (otpNumber) => {
        toPasswordMode(otpNumber);
    });
});
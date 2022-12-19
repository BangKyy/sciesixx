import { deleteCookie, getCookie, setCookie } from "./lib/cookie.js";
import { getOtp } from "./lib/otp.js";
import { TogglePassword } from "./utils/toggle-password.js";

const formEmail = document.querySelector(".form-1");
const formOtp = document.querySelector(".form-2");
const formPassword = document.querySelector(".form-3");
const submitBtns = document.querySelectorAll(".submit-btn");
const passwordInput = document.querySelector("#password-input");
const cpasswordInput = document.querySelector("#cpassword-input");
const passwordEye = document.querySelector(".password-eye");
const cpasswordEye = document.querySelector(".cpassword-eye");

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

const disableBtn = (num) => {
    const btn = submitBtns[num - 1];
    btn.setAttribute("disabled", "disabled");
};

const enableBtn = (num) => {
    const btn = submitBtns[num - 1];
    btn.removeAttribute("disabled");
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
    disableBtn(1);
    const expireDate = new Date();
    expireDate.setTime(Date.now() + (1000 * 60 * 15));
    const email = document.querySelector("#email-input")?.value;
    const otp = getOtp(6);
    const expire = expireDate.getTime();
    const resData = await sendOtpEmail(email, otp, expire);

    if (!resData?.success) {
        showErrors(resData.errorMessages);
        enableBtn(1);
        return;
    }

    await sendMailOtp(email);
    setCookie(document, {
        name: "otp_user",
        value: email,
        expires: 1000 * 60 * 15
    });
    setCookie(document, {
        name: "otp_resend_time",
        value: `${Date.now() + (1000 * 60)}`,
        expires: 1000 * 60 * 15
    });
    
    window.location.reload();
};

const getOtpInput = () => {
    const elements = document.querySelectorAll(".otp-input");
    let otp = "";
    elements.forEach((element) => {
        otp += element.value;
    });
    console.log(otp)
    return otp;
};

const submitOtpForm = async () => {
    disableBtn(2);
    const expireDate = new Date();
    expireDate.setTime(Date.now() + (1000 * 60 * 30));
    const email = getCookie(document, { name: "otp_user" });
    const otp = getOtpInput();
    const expire = expireDate.getTime();
    const resData = await sendOtpNumber(email, otp, expire);

    if (!resData?.success) {
        showErrors(resData.errorMessages);
        enableBtn(2);
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
    disableBtn(3);
    const email = getCookie(document, { name: "otp_user" });
    const password = document.querySelector("#password-input")?.value;
    const cpassword = document.querySelector("#cpassword-input")?.value;

    const resData = await sendOtpPassword(email, password, cpassword);

    if (!resData?.success) {
        showErrors(resData.errorMessages);
        enableBtn(3);
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

    forms.forEach((form, i) => {
        if (i === formNumber - 1) {
            form.classList.remove("form-hidden");
            enableBtn(i + 1);
        } else {
            form.classList.add("form-hidden");
        }
    });
};

const limitOtpInputs = () => {
    const elements = document.querySelectorAll(".otp-input");
    elements.forEach((element) => {
        element.addEventListener("input", (ev) => {
            const value = ev.target.value.trim();
            if (value.length <= 1) return;
            element.value = value.slice(0, 1);
        });
    });
};

const changeElementByMode= (title, description, icon) => {
    const titleElement = document.querySelector(".new-password-right-title");
    const descriptionElement = document.querySelector(".new-password-right-description");
    const img = document.querySelector(".new-password-img2");

    titleElement.innerHTML = title;
    descriptionElement.innerHTML = description;
    img.setAttribute("src", icon);
};

const toEmailMode = () => {
    const title = "Verifikasi Email";
    const description = "Masukan alamat email yang terkait dengan akun anda!";
    const icon = "../../images/verify-email.svg";
    changeElementByMode(title, description, icon);
    changeForm(1);
};

const toOtpMode = (email) => {
    const title = "Masukan OTP";
    const description = "Masukan kode 6 digit yang dikirim ke alamat email anda!";
    const icon = "../../images/verify-otp.svg";
    changeElementByMode(title, description, icon);
    changeForm(2);
};

const toPasswordMode = (otp) => {
    const title = "Atur Ulang Kata Sandi";
    const description = "Kata sandi harus berbeda dari kata sandi yang sebelumnya";
    const icon = "../../images/verify-password.svg";
    changeElementByMode(title, description, icon);
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
    limitOtpInputs();
    new TogglePassword(passwordInput, passwordEye).init();
    new TogglePassword(cpasswordInput, cpasswordEye).init();
});
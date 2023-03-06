import { getQueryOrigin } from "./lib/query-parser.js";
import { getCookie, setCookie } from "./lib/cookie.js";

const select = document.querySelector.bind(document);

const saveAdminUser = (email) => {
    setCookie(document, { name: "admin-user", value: email, expires: 1000 * 60 * 60 });
};

const toggleActiveLoginBtn = (willActive=false) => {
    const formBtn = document.querySelector(".form-btn");
    willActive ? formBtn.removeAttribute("disabled") : formBtn.setAttribute("disabled", "disabled");
};

const redirectOrigin = () => {
    const rawTargetOrigin = getQueryOrigin(window, "target_origin");
    const targetOrigin = decodeURIComponent(rawTargetOrigin || "/");
    window.location.assign(targetOrigin);
};

const handleRedirect = (response={}, payload={}) => {
    const isValidData = "error" in response && response.error === false;
    if (!isValidData) {
        alert("Data tidak valid");
        toggleActiveLoginBtn(true);
        return;
    }
    saveAdminUser(payload.email);
    redirectOrigin();
};

const sendForm = async () => {
    toggleActiveLoginBtn(false);
    const payload = {
        email: select("#email-input").value,
        password: select("#password-input").value,
        last_activity: Date()
    };
    const rawResponse = await fetch("../../rest/admin-login.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const response = await rawResponse.json();
    handleRedirect(response, payload);
};

const checkSubmittedData = (callback, errCallback) => {
    const email = select("#email-input").value;
    const password = select("#password-input").value;
    const isValidEmail = Array.isArray(email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i));
    const isValidPassword = Array.isArray(password.match(/^([a-zA-Z0-9_]+)$/));
    if (!isValidEmail) return errCallback(new Error("Email tidak valid"));
    if (!isValidPassword) return errCallback(new Error("Password tidak valid"));
    callback();
};

const initForm = () => {
    const form = select(".form");
    const formBtn = select(".form-btn");
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
    });
    formBtn.addEventListener("click", () => {
        checkSubmittedData(() => {
            sendForm();
        }, (err=new Error("Error")) => {
            alert(err.message);
        });
    });
};

window.addEventListener("load", () => {
    initForm();
});
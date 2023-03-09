import { TogglePassword } from "./utils/toggle-password.js";
import { setCookie } from "./lib/cookie.js";

const select = document.querySelector.bind(document);

const displayErrors = (errors) => {
    const errorContainer = document.querySelector(".error-container");
    const errorList = `
        <ul style="list-style-type:none;" class="mt-0 mb-0 pt-0 pb-0">
            ${errors.map((error) => `
                <li class="pt-0 pb-0 mt-0 mb-0">
                    <span class="text-danger pt-0 pb-0 mt-0 mb-0">*${error}</span>
                </li>`
            ).join("")}
        </ul>
    `;
    const errorElement = `
        <div style="max-width:500px;" class="container-sm d-flex align-items-center alert alert-danger pt-2 pb-2" role="alert">
            ${errorList}
        </div>
    `;

    errorContainer.innerHTML = errorElement;
};

const toggleActiveLoginBtn = (willActive=false) => {
    const formBtn = select(".form-btn");
    willActive ? formBtn.removeAttribute("disabled") : formBtn.setAttribute("disabled", "disabled");
}

const handleSuccessfulLogin = (data) => {
    setCookie(document, { name: "teacher", value: data.name, expires: 1000 * 60 * 60 });
    location.assign("../");
};

const sendForm = async ({ code }) => {
    try {
        toggleActiveLoginBtn(false);
        const payload = { code };
        const rawResponse = await fetch("../rest/teacher-login.php", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response = await rawResponse.json();
        if (response?.error === true) {
            throw new Error("Error");
        }
        handleSuccessfulLogin(response.data);
    } catch (err) {
        displayErrors(["Kode salah"]);
        toggleActiveLoginBtn(true);
    }
};

const initTogglePassword = () => {
    const passwordInput = select(".password-input");
    const passwordEye = select(".password-eye");
    const togglePassword = new TogglePassword(passwordInput, passwordEye);
    togglePassword.init();
};

const initForm = () => {
    const form = select(".form");
    const passwordInput = select(".password-input");
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        sendForm({ code: passwordInput.value });
    });
};

window.addEventListener("load", () => {
    initTogglePassword();
    initForm();
});
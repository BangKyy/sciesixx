import { setCookie } from "./lib/cookie.js";
import { TogglePassword } from "./utils/toggle-password.js";

const select = (selector) => document.querySelector(selector);
const form = document.querySelector(".form");
const passwordInput = document.querySelector("#password-input");
const passwordEye = document.querySelector(".password-eye");

const rememberObj = {
    shouldRemember: false,
    checkbox: document.querySelector(".remember-me"),
    emailInput: document.querySelector("#email-input"),
    email: "",

    init() {
        this.checkbox.addEventListener("click", () => {
            this.toggle();
        });
        this.emailInput.addEventListener("input", (ev) => {
            this.email = ev.target.value;
            this.write();
        });
        this.loadChecked();
    },

    loadChecked() {
        const email = localStorage.getItem("unisix-email");
        if (!email) return;
        this.shouldRemember = true;
        this.checkbox.setAttribute("checked", "checked");
        this.emailInput.value = email;
        this.email = email;
    },

    toggle() {
        this.shouldRemember = !this.shouldRemember;
        this.shouldRemember ? this.add() : this.delete();
    },

    add() {
        window.localStorage.setItem("unisix-email", this.email);
    },

    write() {
        if (!this.shouldRemember) return;
        this.add();
    },

    delete() {
        window.localStorage.removeItem("unisix-email")
    }
};

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

const sendUserData = async (email, password) => {
    const date = Date();
    const payload = { email, password, date };
    const rawResponse = await fetch("../rest/login.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const response = await rawResponse.json();

    return response;
};

const submitForm = async () => {
    const [email, password] = [
        select("#email-input").value?.trim().toLowerCase(),
        select("#password-input").value?.trim()
    ];
    const resUserData = await sendUserData(email, password);
    const { errorMessages, user } = resUserData;

    if (errorMessages.length) {
        displayErrors(errorMessages);
        return;
    }

    setCookie(document, {
        name: "user",
        value: email,
        expires: 1000 * 60 * 60
    });
    setCookie(document, {
        name: "username",
        value: user.username,
        expires: 1000 * 60 * 60
    });
    window.open("../", "_self");
};

// const autoFIllEmail = () => {
//     const emailInput = document.querySelector("#email-input");
//     const email = localStorage.getItem("unisix-email");
//     if (!email) return;
//     emailInput.value = email;
// };

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    submitForm();
});

window.addEventListener("load", () => {
    // autoFIllEmail();
    rememberObj.init();
    new TogglePassword(passwordInput, passwordEye).init();
});
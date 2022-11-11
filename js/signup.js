import { setCookie } from "./lib/cookie.js";

const select = (selector) => document.querySelector(selector);
const form = document.querySelector(".form");

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

const sendUserData = async (username, email, password, cpassword) => {
    const payload = { username, email, password, cpassword, date: Date() };
    const rawResponse = await fetch("../rest/signup.php", {
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
    const [username, email, password, cpassword] = [
        select("#username-input").value?.trim().toLowerCase(),
        select("#email-input").value?.trim().toLowerCase(),
        select("#password-input").value?.trim(),
        select("#cpassword-input").value?.trim()
    ];
    const resUserData = await sendUserData(username, email, password, cpassword);
    const { errorMessages } = resUserData;

    if (errorMessages.length) {
        displayErrors(errorMessages);
        return;
    }

    setCookie(document, {
        name: "user",
        value: email,
        expires: 1000 * 60 * 60
    });
    location.reload();
};

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    submitForm();
});
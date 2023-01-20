import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const formBtn = document.querySelector(".form-btn");

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

const sendForm = async (name, email, message, date=Date()) => {
    const payload = { name, email, message, date };
    const rawData = await fetch("../rest/contact.php", {
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
    const select = document.querySelector.bind(document);
    const [ name, email, message ] = [
        select("#name-input").value,
        select("#email-input").value,
        select("#message-input").value
    ];

    formBtn.removeEventListener("click", submitForm);
    formBtn.setAttribute("disabled", "disabled");

    try {
        if (!(name.trim() && email.trim() && message.trim())) throw new Error(["Semua input wajib diisi!"]);
        const resData = await sendForm(name, email, message);
        if (resData?.error) throw new Error(resData?.errorMessages || ["Telah terjadi kesalahan"]);
        window.location.reload();
    } catch (err) {
        displayErrors([err.message]);
        formBtn.addEventListener("click", submitForm);
        formBtn.removeAttribute("disabled");
    }
};

formBtn.addEventListener("click", submitForm);
window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    generateDynamicSiteName("../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../json/social-media.json");
    new UpArrow(".up-arrow-container").init();
});
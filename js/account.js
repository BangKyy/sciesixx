import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { getCookie, setCookie } from "./lib/cookie.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const select = document.querySelector.bind(document);

const showError = async (message="Telah terjadi kesalahan") => {
    await Swal.fire("Error", message, "error");
};

const getUser = () => getCookie(document, { name: "user" });

const checkUser = (callback) => {
    const userEmail = getUser();
    if (!userEmail) return location.assign("../login/");
    callback();
};

const getSavedUser = async () => {
    const email = getUser();
    const rawData = await fetch(`../rest/account.php?email=${email}`);
    const data = await rawData.json();
    return data;
}

const updateUser = async (value, key="username") => {
    const email = getUser();
    const payload = { email, key, value };
    const rawResponse = await fetch("../rest/account.php", {
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

const updateUserAndValidateUsername = async (username, callback, errCallback) => {
    try {
        const email_cache = getUser(); 
        const payload = { username, email_cache };
        const rawValidationData = await fetch("../rest/account.php", {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const validationData = await rawValidationData.json();
        if ("error" in validationData && validationData?.error === true) {
            throw {
                messages: validationData.errorMessages,
                firstMessage: validationData.errorMessages[0]
            };
        }
        const updatedUser = await updateUser(username);
        callback();
    } catch (err) {
        const defaultErrorMessage = {
            messages: ["Telah terjadi kesalahan"],
            firstMessage: "Telah terjadi kesalahan"
        };
        const error = err instanceof Error ? defaultErrorMessage : err;
        errCallback(error);
        console.log(err);
        console.log(error);
    }
};

const toggleActiveBtns = (willActive=false) => {
    const btnElements = [
        select(".btn-username"),
        select(".btn-password"),
        select(".btn-delete"),
    ];
    btnElements.forEach((btn) => {
        willActive ? btn.removeAttribute("disabled") : btn.setAttribute("disabled", "disabled");
    });
};

const fillUsernameInput = (value) => {
    const usernameInput = select(".username-input");
    usernameInput.value = value;
};

const btnAction = {
    async updateUser() {
        toggleActiveBtns(false);
        const usernameValue = select(".username-input").value?.toLowerCase();
        updateUserAndValidateUsername(usernameValue, () => {
            location.assign("./");
        }, async (err) => {
            await showError(err?.firstMessage);
            toggleActiveBtns(true);
        });
    },
    
    redirectPassword() {
        toggleActiveBtns(false);
        const targetUrl = "../login/new-password/";
        location.assign(targetUrl);
    },
    
    deleteAccount() {
        toggleActiveBtns(false);
        const targetUrl = "./delete/";
        location.assign(targetUrl);
    }
};

const initBtnEvents = () => {
    const btnElements = [
        select(".btn-username"),
        select(".btn-password"),
        select(".btn-delete"),
    ];
    const actions = [
        btnAction.updateUser,
        btnAction.redirectPassword,
        btnAction.deleteAccount
    ];
    btnElements.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            actions[i].call(btnAction);
        });
    });
};

const initUsernameInput = async () => {
    try {
        const user = await getSavedUser();
        fillUsernameInput(user.username);
        initBtnEvents();
        toggleActiveBtns(true);
    } catch (err) {
        console.log(err);
        await showError();
    }
};

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    checkUser(() => {
        initUsernameInput();
    });
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
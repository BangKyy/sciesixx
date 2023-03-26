import { deleteCookie, getCookie } from "./lib/cookie.js";

const redirectToRoot = () => {
    location.assign("../../");
};

const getUser = (name="user") => getCookie(document, { name });

const deleteSavedUser = async () => {
    const email = getUser();
    const payload = { email };
    const rawResponse = await fetch("../../rest/delete-user.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const response = await rawResponse.json();
    console.log(response);
    return response;
};

const deleteCachedUser = () => {
    deleteCookie(document, { name: "user" });
    deleteCookie(document, { name: "username" });
    localStorage.removeItem("unisix-email");
};

const checkUser = (callback, errCallback) => {
    const email = getUser("user");
    const username = getUser("username");
    const isUserExists = !!(email && username);
    if (!isUserExists) return errCallback();
    callback();
};

const initUser = () => {
    checkUser(async () => {
        await deleteSavedUser();
        deleteCachedUser();
        redirectToRoot();
    }, () => {
        redirectToRoot();
    });
};

window.addEventListener("load", () => {
    initUser();
});
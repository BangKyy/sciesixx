import { getQueryOrigin } from "./lib/query-parser.js";
import { deleteCookie } from "./lib/cookie.js";

const logOutUser = () => {
    const lastOrigin = getQueryOrigin(window, "last_origin");
    deleteCookie(document, { name: "user "});
    window.location.assign(lastOrigin || "/");
};

window.addEventListener("load", () => {
    logOutUser();
});
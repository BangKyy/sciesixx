import { getCookie } from "../lib/cookie.js";

(() => {
    const select = document.querySelector.bind(document);
    const loaderContainer = select(".loader-container");
    const adminUser = getCookie(document, { name: "admin-user" });
    const encOrigin = encodeURIComponent(location.href);
    const targetUrl = `./login/?target_origin=${encOrigin}`;
    !!adminUser ? loaderContainer.style.display = "none" : location.assign(targetUrl);
})();
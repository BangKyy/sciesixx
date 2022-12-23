import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";

window.addEventListener("load", () => {
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document);
    nav.toggleSignBtn(document, ".sign-button-list");
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../json/social-media.json");
});
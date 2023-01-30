import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Earthquake } from "./utils/earthquake.js";
import { UpArrow } from "./partials/float.js";

const earthquake = new Earthquake();

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    earthquake.init();
    generateDynamicSiteName("../../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../../json/social-media.json");
    new UpArrow(".up-arrow-container").init();
});
import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";

window.addEventListener("scroll", () => {
    nav.changeNavColor(document, window.scrollY);
    nav.toggleNavShadow(document, window.scrollY);
});
window.addEventListener("load", () => {
    nav.toggleSignBtn(document);
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document);
});
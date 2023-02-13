import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const toggleActive = (index, btns, sections) => {
    btns.forEach((btn) => {
        btn.classList.remove("practice-toggle-active");
    });
    sections.forEach((section) => {
        section.classList.add("container-hidden");
    });
    btns[index].classList.add("practice-toggle-active");
    sections[index].classList.remove("container-hidden");
};

const initToggle = () => {
    const toggleBtns = document.querySelectorAll(".practice-toggle");
    const sections = document.querySelectorAll(".practice-section-container");
    toggleBtns.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            toggleActive(i, toggleBtns, sections);
        });
    });
};

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    initToggle();
    generateDynamicSiteName("../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../json/social-media.json");
    new UpArrow(".up-arrow-container").init();
});
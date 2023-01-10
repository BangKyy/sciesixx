import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";

const toggleProject = (containers, toggles, index) => {
    containers.forEach((container, i) => {
        if (index !== i) {
            container.style.display = "none";
            toggles[i].classList.remove("education-toggle-active");
            return;
        }

        container.style.display = "flex";
        toggles[i].classList.add("education-toggle-active");
    });
};

const initToggle = () => {
    const containers = document.querySelectorAll(".project-container");
    const toggles = document.querySelectorAll(".education-toggle");
    toggles.forEach((toggle, i) => {
        toggle.addEventListener("click", () => {
            toggleProject(containers, toggles, i);
        });
    });
};

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    generateDynamicSiteName("../../json/config.json");
    initToggle()
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../json/social-media.json");
});
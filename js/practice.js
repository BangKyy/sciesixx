import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const getImageElement = (number, sectionNumber, orientation) => {
    return `
        <div class="${orientation}">
            <div class="${orientation}-practice-container">
                <img class="${orientation}-practice" src="../../images/practice/section-${sectionNumber}/practice-${orientation}-${number}.jpg" alt="">
            </div>
            <div class="${orientation}-link-container">
                <a href="../../images/practice/section-${sectionNumber}/practice-${orientation}-${number}.jpg" class="${orientation}-link">Buka gambar</a>
                <i class="${orientation}-arrow-link bi bi-arrow-right-short"></i>
            </div>
        </div>
    `;
};

const getImageCounts = async () => {
    const rawData = await fetch("../../rest/practice-image.php");
    const data = await rawData.json();
    return data;
};

const mightToggleGridContainer = (containers, emptyContainers, count, index) => {
    const containerDisplay = count > 0 ? "grid" : "none";
    const emptyDisplay = count > 0 ? "none" : "grid";
    containers[index].style.display = containerDisplay;
    emptyContainers[index].style.display = emptyDisplay;
};

const mightToggleBothGridContainers = (landscapeContainers, portraitContainers, landscapeEmptyContainers, portraitEmptyContainers, imageCount, index) => {
    mightToggleGridContainer(landscapeContainers, landscapeEmptyContainers, imageCount?.landscape_count, index);
    mightToggleGridContainer(portraitContainers, portraitEmptyContainers, imageCount?.portrait_count, index);
};

const insertImages = (landscapeContainers, portraitContainers, imageCount, index) => {
    const landscapeImages = Array(parseInt(imageCount?.landscape_count)).fill(1).map((arr, i) => {
        return getImageElement(i + 1, index + 1, "landscape");
    });
    const portraitImages = Array(parseInt(imageCount?.portrait_count)).fill(1).map((arr, i) => {
        return getImageElement(i + 1, index + 1, "portrait");
    });
    const landscapeElementString = landscapeImages.join();
    const portraitElementString = portraitImages.join();
    landscapeContainers[index].innerHTML = landscapeElementString;
    portraitContainers[index].innerHTML = portraitElementString;
};

const setupImages = async () => {
    const landscapeContainers = document.querySelectorAll(".landscape-grid-container");
    const portraitContainers = document.querySelectorAll(".portrait-grid-container");
    const landscapeEmptyContainers = document.querySelectorAll(".landscape-empty-container");
    const portraitEmptyContainers = document.querySelectorAll(".portrait-empty-container");
    const imageCounts = await getImageCounts();
    imageCounts.forEach((imageCount, i) => {
        insertImages(landscapeContainers, portraitContainers, imageCount, i);
        mightToggleBothGridContainers(landscapeContainers, portraitContainers, landscapeEmptyContainers, portraitEmptyContainers, imageCount, i);
    });
};

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
    setupImages();
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
import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const getPhotoElement = (number, orientation) => {
    return `
        <div class="${orientation}">
            <div class="${orientation}-photo-container">
                <img class="${orientation}-photo" src="../../images/photo/photo-${orientation}-${number}.jpg" alt="">
            </div>
            <div class="${orientation}-link-container">
                <a href="../../images/photo/photo-${orientation}-${number}.jpg" class="${orientation}-link">Buka gambar</a>
                <i class="${orientation}-arrow-link bi bi-arrow-right-short"></i>
            </div>
        </div>
    `;
};

const getPhotoCounts = async () => {
    const rawData = await fetch("../../rest/photo-image.php");
    const data = await rawData.json();
    return data;
};

const insertPhotos = (landscapeContainer, portraitContainer, photoCounts) => {
    const landscapePhotos = Array(parseInt(photoCounts[0]?.landscape_count)).fill(1).map((arr, i) => {
        return getPhotoElement(i + 1, "landscape");
    });
    const portraitPhotos = Array(parseInt(photoCounts[0]?.portrait_count)).fill(1).map((arr, i) => {
        return getPhotoElement(i + 1, "portrait");
    });
    landscapePhotos.reverse();
    portraitPhotos.reverse();
    landscapeContainer.innerHTML = landscapePhotos.join("");
    portraitContainer.innerHTML = portraitPhotos.join("");
};

const setupPhotos = async () => {
    const landscapeContainer = document.querySelector(".landscape-grid-container");
    const portraitContainer = document.querySelector(".portrait-grid-container");
    const photoCounts = await getPhotoCounts();
    insertPhotos(landscapeContainer, portraitContainer, photoCounts);
};

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    setupPhotos();
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
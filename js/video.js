import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const getVideoElement = (number, orientation) => {
    return `
        <div class="${orientation}">
            <div class="${orientation}-video-container">
                <img class="${orientation}-video" src="../../images/thumbnail/video-thumbnail-${orientation}-${number}.jpg" alt="">
            </div>
            <div class="${orientation}-link-container">
                <a href="../../videos/video/video-${orientation}-${number}.mp4" class="${orientation}-link">Buka video</a>
                <i class="${orientation}-arrow-link bi bi-arrow-right-short"></i>
            </div>
        </div>
    `;
};

const getVideoCounts = async () => {
    const rawData = await fetch("../rest/video-image.php");
    const data = await rawData.json();
    return data;
};

const insertThumbnails = (landscapeContainer, portraitContainer, videoCounts) => {
    const landscapeThumbnails = Array(parseInt(videoCounts[0]?.landscape_count)).fill(1).map((arr, i) => {
        return getVideoElement(i + 1, "landscape");
    });
    const portraitThumbnails = Array(parseInt(videoCounts[0]?.portrait_count)).fill(1).map((arr, i) => {
        return getVideoElement(i + 1, "portrait");
    });
    landscapeThumbnails.reverse();
    portraitThumbnails.reverse();
    landscapeContainer.innerHTML = landscapeThumbnails.join("");
    portraitContainer.innerHTML = portraitThumbnails.join("");
};

const setupThumbnails = async () => {
    const landscapeContainer = document.querySelector(".landscape-grid-container");
    const portraitContainer = document.querySelector(".portrait-grid-container");
    const videoCounts = await getVideoCounts();
    insertThumbnails(landscapeContainer, portraitContainer, videoCounts);
};

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    // setupThumbnails();
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
import { getCookie } from "../lib/cookie.js";
import { Sidebar } from "../utils/sidebar.js";

const changeNavColor = (document, scrollY) => {
    const nav = document.querySelector(".nav");
    const scrollPositions = [0, 680, 2200];
    const bgColors = ["#a4bad6", "#e8eef5", "#dde8f7"];
    const currentScrollPositions = scrollPositions.filter((position) => position <= scrollY);
    const bgColorsIndex = currentScrollPositions.length - 1;
    // nav.style.backgroundColor = scrollY > 0 ? bgColors[bgColorsIndex] : "transparent";
    nav.style.backgroundColor = bgColors[bgColorsIndex];
};

const toggleNavShadow = (document, scrollY) => {
    const nav = document.querySelector(".nav");
    const boxShadow = "0 1px 2px 0.1px #00000020";
    nav.style.boxShadow = scrollY > 50 ? boxShadow : "none";
};

const toggleSignBtn = (document, selector=".sign-btn-container") => {
    const signBtnContainer = document.querySelector(selector);
    const origin = encodeURIComponent(window.location.href);
    const logOutElement = `
        <a href="./logout?last_origin=${origin}" class="sign-btn logout-btn btn btn-sm btn-danger text-white">Keluar</a>
    `;
    const cookieData = getCookie(document, { name: "user" });

    if (!cookieData) return;
    signBtnContainer.innerHTML = logOutElement;
};

const initSidebar = (element=null, btn=null, bars=[]) => {
    const select = document.querySelector.bind(document);
    const selectAll = document.querySelectorAll.bind(document);
    element ? 0 : element = select(".sidebar");
    btn ? 0 : btn = select(".menu-icon");
    bars.length ? 0 : bars = selectAll(".menu-bar");
    new Sidebar(element, btn, bars).init({ hidden: true });
};

export {
    changeNavColor,
    toggleNavShadow,
    toggleSignBtn,
    initSidebar
};
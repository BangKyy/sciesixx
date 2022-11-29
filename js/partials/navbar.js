import { getCookie } from "../lib/cookie.js";

const changeNavColor = (document, scrollY) => {
    const nav = document.querySelector(".nav");
    const scrollPositions = [0, 680, 2200];
    const bgColors = ["#a4bad6", "#e8eef5", "#dde8f7"];
    const currentScrollPositions = scrollPositions.filter((position) => position <= scrollY);
    const bgColorsIndex = currentScrollPositions.length - 1;
    nav.style.backgroundColor = scrollY > 0 ? bgColors[bgColorsIndex] : "transparent";
};

const toggleNavShadow = (document, scrollY) => {
    const nav = document.querySelector(".nav");
    const boxShadow = "0 1px 2px 0.1px #00000020";
    nav.style.boxShadow = scrollY > 50 ? boxShadow : "none";
};

const toggleSignBtn = (document) => {
    const signBtnContainer = document.querySelector(".sign-btn-container");
    const origin = encodeURIComponent(window.location.href);
    const logOutElement = `
        <a href="./logout?last_origin=${origin}" class="sign-btn logout-btn btn btn-sm btn-danger">Keluar</a>
    `;
    const cookieData = getCookie(document, { name: "user" });

    if (!cookieData) return;
    signBtnContainer.innerHTML = logOutElement;
};

export {
    changeNavColor,
    toggleNavShadow,
    toggleSignBtn
};
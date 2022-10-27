const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");

// ============ nav ===============
const changeNavColor = (scrollY) => {
    const scrollPositions = [0, 580, 1300];
    const colors = ["#a4bad6", "#e8eef5", ""];
    const nav = document.querySelector(".nav");
    console.log(scrollY);
};
// ============ End nav ============

// ============ Footer =============
const generateDynamicCopyrightYear = () => {
    const element = document.querySelector(".dynamic-copyright-year");
    const date = new Date();
    const yearNow = date.getFullYear();
    element.innerHTML = yearNow > 2022 ? `- ${yearNow}` : ``;
}

const getSocmedInfo = async () => {
    const rawData = await fetch("./json/social-media.json");
    const data = await rawData.json();
    return data;
};

const updateSocmedUrl = async () => {
    const [igLink, dcLink] = [
        document.querySelector(".ig-link"),
        document.querySelector(".dc-link")
    ];
    const [ igElement, dcElement ] = [
        document.querySelector(".ig-link"),
        document.querySelector(".dc-link")
    ];
    const socmedInfo = await getSocmedInfo();
    const [igData, dcData] = [
        socmedInfo.instagram,
        socmedInfo.discord
    ];
    const igUrl = igData.base_url + igData.username;
    const dcUrl = dcData.base_url + dcData.username;

    igLink.href = igUrl;
    dcLink.href = dcUrl;
};
// ============ End footer =============

loginBtn.addEventListener("click", () => {
    
});
signupBtn.addEventListener("click", () => {

});
window.addEventListener("scroll", () => {
    changeNavColor(this.scrollY);
});
window.addEventListener("load", () => {
    generateDynamicCopyrightYear();
    updateSocmedUrl();
});
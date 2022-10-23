const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");

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
    const [ igElement, dcElement ] = [
        document.querySelector(".ig-link"),
        document.querySelector(".dc-link")
    ];
    const socmedInfo = await getSocmedInfo();
    const [igUrl, dcUrl] = [
        
    ];
};

loginBtn.addEventListener("click", () => {
    
});
signupBtn.addEventListener("click", () => {

});
window.addEventListener("load", () => {
    generateDynamicCopyrightYear();
});
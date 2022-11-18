const loginBtn = document.querySelector(".login-btn");
const signupBtn = document.querySelector(".signup-btn");

// ============ nav ===============
const changeNavColor = (scrollY) => {
    const nav = document.querySelector(".nav");
    const scrollPositions = [0, 680, 2200];
    const bgColors = ["#a4bad6", "#e8eef5", "#dde8f7"];
    const currentScrollPositions = scrollPositions.filter((position) => position <= scrollY);
    const bgColorsIndex = currentScrollPositions.length - 1;
    nav.style.backgroundColor = scrollY > 0 ? bgColors[bgColorsIndex] : "transparent";
};
// ============ End nav ============

// ============ Contact =============
function contactmsg(){
    var Name = document.getElementById('name');
    var email = document.getElementById('email');
    var msg = document.getElementById('msg');
    const success = document.getElementById('success');
    const danger = document.getElementById('danger');

    if(Name.value === '' || email.value === '' || msg.value === ''){
        danger.style.display = 'block';
    }
    else {
        setTimeout(() => {
            Name.value = '';
            email.value = '';
            msg.value = '';
        }, 2000);

        success.style.display = 'block';
    }

    setTimeout(() => {
        danger.style.display = 'none';
        success.style.display = 'none';
    }, 4000);
}
// ============ End Contact =============

// ============ Footer =============
const generateDynamicCopyrightYear = () => {
    const element = document.querySelector(".dynamic-copyright-year");
    const date = new Date();
    const yearNow = date.getFullYear();
    element.innerHTML = yearNow > 2022 ? `-${yearNow}` : ``;
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

window.addEventListener("scroll", () => {
    changeNavColor(this.scrollY);
});
window.addEventListener("load", () => {
    generateDynamicCopyrightYear();
    updateSocmedUrl();
});
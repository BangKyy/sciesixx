export const generateDynamicSiteName = async (path="", selectorAll="") => {
    path = path || "./json/config.json";
    selectorAll = selectorAll || ".site-name";
    const elements = document.querySelectorAll(selectorAll);
    const rawConfig = await fetch(path);
    const config = await rawConfig.json();
    elements.forEach((element) => {
        element.innerHTML = config.name;
    });
};

// const getSessionConfig = () => {
//     const payload = window.sessionStorage.getItem("unisix-config");
//     const config = JSON.parse(payload);
//     return config;
// };

// const saveSessionConfig = async () => {
//     const rawConfig = await fetch(path);
//     const config = await rawConfig.json();
//     const payload = JSON.stringify(config);
//     window.sessionStorage.setItem("unisix-config", payload);
// };

// export const styleSignBtnContainer = async (path="") => {
//     path = path || "./json/config.json";
//     if (!getSessionConfig()) await saveSessionConfig();
//     const sessionConfig = getSessionConfig();
//     const width = window.innerWidth;
//     const element = document.querySelector(".sign-btn-container");

//     const style = {
//         async styleMobile() {
//             element.style.width = config?.styleMobile?.signBtnContainer?.width;
//         },

//         async styleTablet() {
//             element.style.width = sessionConfig?.styleTablet?.signBtnContainer?.width;
//         },

//         async styleLaptop(element) {
            
//         },
//     }

//     const styleDevice = width <= 576 ? "styleMobile" :
//         width <= 992 && width > 576 ? "styleTablet" :
//         width > 992 ? "styleLaptop" :
//         "";

//     await style[styleDevice]();
// };

// export const styleSignBtnContainer = async (path="") => {
//     const style = {
//         async styleMobile(element) {
//             // element.style.width = config?.styleMobile?.signBtnContainer?.width;
//         },

//         async styleTablet(element) {
//             const rawConfig = await fetch(path);
//             const config = await rawConfig.json();
//             element.style.width = config?.styleTablet?.signBtnContainer?.width;
//         },

//         async styleLaptop(element) {
            
//         },

//         "": async () => null
//     };

//     path = path || "./json/config.json";
//     const width = window.innerWidth;
//     const element = document.querySelector(".sign-btn-container");
    // const styleDevice = width <= 576 ? "styleMobile" :
    //     width <= 992 && width > 576 ? "styleTablet" :
    //     width > 992 ? "styleLaptop" :
    //     "";

    // await style[styleDevice](element);
// };

// export const generateDynamicSiteStyle = async (path, selector, properties, devices) => {
//     if (!(path && selector && properties && devices)) return console.log(false);
//     const width = window.innerWidth;
//     const element = document.querySelector(selector);
// };
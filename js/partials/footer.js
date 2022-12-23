const generateDynamicCopyrightYear = (document) => {
    const element = document.querySelector(".dynamic-copyright-year");
    const date = new Date();
    const yearNow = date.getFullYear();
    element.innerHTML = yearNow > 2022 ? `-${yearNow}` : ``;
}

const getSocmedInfo = async (path="") => {
    const rawData = await fetch(path || "./json/social-media.json");
    const data = await rawData.json();
    return data;
};

const updateSocmedUrl = async (document, path) => {
    const [igLink, dcLink] = [
        document.querySelector(".ig-link"),
        document.querySelector(".dc-link")
    ];
    const socmedInfo = await getSocmedInfo(path);
    const [igData, dcData] = [
        socmedInfo.instagram,
        socmedInfo.discord
    ];
    const igUrl = igData.base_url + igData.username;
    const dcUrl = dcData.base_url + dcData.username;

    igLink.href = igUrl;
    dcLink.href = dcUrl;
};

export {
    generateDynamicCopyrightYear,
    getSocmedInfo,
    updateSocmedUrl
};
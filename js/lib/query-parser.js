const getQueryOrigin = (window, searchKey="") => {
    const origin = decodeURIComponent(window.location.search);
    const originEntries = origin.split("?", 2)[1].split("&").map((v) => v.split("=").map(w => w.trim()));
    const originObjs = originEntries.map((originArr) => {
        const output = {};
        output[originArr[0]] = originArr[1];
        return output;
    });
    const output = !searchKey ? originObjs : originObjs.find((obj) => searchKey in obj)?.[searchKey];
    return output;
};

export {
    getQueryOrigin
};
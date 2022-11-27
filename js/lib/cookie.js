export const getCookie = (document, { name }) => {
    const cookies = document.cookie
        .split(";")
        .map((c) => c.trim())
        .map((c) => {
            const entry = c.split("=");
            return {
                name: entry[0],
                value: entry[1]
            };
        });
    const cookie = cookies.find((c) => c.name === name);
    
    return cookie?.value;
};

export const setCookie = (document, { name, value, expires, path="/" }) => {
    value = typeof value === "object" ? JSON.stringify(value) : value;
    const expireDate = new Date(Date.now() + expires);
    const cookie = `${name}=${value}; expires=${expireDate.toUTCString()}; path=${path}`;
    document.cookie = cookie;
};

export const deleteCookie = (document, { name, path="/" }) => {
    const date = new Date();
    date.setUTCFullYear(1970, 0, 1);
    const cookie = `${name}=; expires=${date.toUTCString()}; path=${path}`;
    document.cookie = cookie;
};
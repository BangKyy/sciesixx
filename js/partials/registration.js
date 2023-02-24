import { getCookie } from "../lib/cookie.js";

const select = document.querySelector.bind(document);

export class RegistrationFloat {
    static mainSectionElement = select(".fr-section");

    constructor() {
        this.mainSectionElement = RegistrationFloat.mainSectionElement;
    }

    init() {
        this.checkUser();
    }

    getUser() {
        const user = getCookie(document, { name: "user" });
        return user;
    }

    checkUser() {
        const user = this.getUser();
        if (!user) return false;
        this.hide();
    }

    hide() {
        this.mainSectionElement.style.display = "none";
    }
}
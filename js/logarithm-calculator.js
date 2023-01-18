import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Calculator } from "./utils/calculator.js";

class LogarithmCalculator extends Calculator {
    constructor() {
        super();
    }
    
    init() {
        super.init();
        this.historyName = "logarithm_calculator_history";
    }
}

const calculator = new LogarithmCalculator();

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    calculator.init();
    calculator.generatePastHistories();
    calculator.displayHistories();
    generateDynamicSiteName("../../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../../json/social-media.json");
});
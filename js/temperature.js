import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";

class TemperatureConverter {
    static amountInput = document.querySelector("#amount");
    static resultInput = document.querySelector("#result");
    static fromSelect = document.querySelector("#from");
    static toSelect = document.querySelector("#to");

    constructor() {
        this.amountInput = TemperatureConverter.amountInput;
        this.resultInput = TemperatureConverter.resultInput;
        this.fromSelect = TemperatureConverter.fromSelect;
        this.toSelect = TemperatureConverter.toSelect;
        this.from = "rankie";
        this.to = "rankie";
        this.output = "";
    }

    init() {
        this.amountInput.addEventListener("keyup", (ev) => {
            this.convert(ev.target.value);
            this.display();
        });
        this.fromSelect.addEventListener("change", (ev) => {
            this.from = ev.target.value.toLowerCase();
        });
        this.toSelect.addEventListener("change", (ev) => {
            this.to = ev.target.value.toLowerCase();
        });
    }

    convert(value) {
        const { result, formula } = this.calculate(value)[this.from](this.to);
    }

    calculate(value) {
        const evaluate = (x, f) => {

        };

        const resultObj = {
             rankine(to) {
                const formula = {
                    rankine: "x * 1",
                    reamur: "(x - 491.67) * 0.44444",
                    fahrenheit: "(x - 491.67) + 32",
                    kelvin: "(x - 491.67) / 1.8 + 273.15",
                    celsius: "(x - 491.67) / 1.8"
                };
             },

             reamur(to) {
                const formula = {
                    rankine: "(x * 2.25) + 491.67",
                    reamur: "x * 1",
                    fahrenheit: "(x * 2.25) + 32",
                    kelvin: "(x * 1.25) + 273.15",
                    celsius: "x / 0.8"
                };
             },

             fahrenheit(to) {
                const formula = {
                    rankine: "(x - 32) + 491.67",
                    reamur: "(x - 32) * 0.44444",
                    fahrenheit: "x * 1",
                    kelvin: "(x - 32) / 1.8 + 273.15",
                    celsius: "(x - 32) / 1.8"
                };
             },

             kelvin(to) {
                const formula = {
                    rankine: "(x - 273.15) * 1.8 + 491.67",
                    reamur: "(x - 273.15) * 0.8",
                    fahrenheit: "(x - 273.15) * 1.8 + 32",
                    kelvin: "x * 1",
                    celsius: "x - 273.15"
                };
             },

             celsius(to) {
                const formula = {
                    rankine: "(x * 1.8) + 491.67",
                    reamur: "x * 0.8",
                    fahrenheit: "(x * 1.8) + 32",
                    kelvin: "x + 273.15",
                    celsius: "x * 1"
                };
             },

             "": () => ""
        }

        return resultObj;
    }

    display() {

    }

    displayFormula() {

    }
}

const converter = new TemperatureConverter();

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    converter.init();
    generateDynamicSiteName("../../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../../json/social-media.json");
});
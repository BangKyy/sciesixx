import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Converter } from "./utils/converter.js";
import { UpArrow } from "./partials/float.js";

class TemperatureConverter extends Converter {
    constructor() {
        super();
        this.from = "rankine";
        this.to = "rankine";
    }

    init() {
        super.init();
    }

    convert(value) {
        super.convert(value);
    }

    calculate(value) {
        value = parseFloat(value);

        const unitObj = {
            rankine: "&deg;R",
            reamur: "&deg;r",
            fahrenheit: "&deg;F",
            kelvin: "K",
            celsius: "&deg;C"
        };

        const evaluate = (formula, value) => {
            const expr = formula.replace(/x/g, value);
            try {
                const evaluated = math.evaluate(expr);
                const result = evaluated ? evaluated : evaluated === 0 ? "0" : "";
                return String(result);
            } catch (err) {
                console.error(err);
                return "";
            }
        };

        const getFormula = (from, rawFormula) => {
            const unit = unitObj[from];
            const formula = rawFormula.replace(/x/g, unit);
            return formula;
        };

        const resultObj = {
             rankine(to) {
                const formulaObj = {
                    rankine: "x * 1",
                    reamur: "(x - 491.67) * 0.44444",
                    fahrenheit: "(x - 491.67) + 32",
                    kelvin: "(x - 491.67) / 1.8 + 273.15",
                    celsius: "(x - 491.67) / 1.8"
                };
                const formula = getFormula("rankine", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             reamur(to) {
                const formulaObj = {
                    rankine: "(x * 2.25) + 491.67",
                    reamur: "x * 1",
                    fahrenheit: "(x * 2.25) + 32",
                    kelvin: "(x * 1.25) + 273.15",
                    celsius: "x / 0.8"
                };
                const formula = getFormula("reamur", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             fahrenheit(to) {
                const formulaObj = {
                    rankine: "(x - 32) + 491.67",
                    reamur: "(x - 32) * 0.44444",
                    fahrenheit: "x * 1",
                    kelvin: "(x - 32) / 1.8 + 273.15",
                    celsius: "(x - 32) / 1.8"
                };
                const formula = getFormula("fahrenheit", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             kelvin(to) {
                const formulaObj = {
                    rankine: "(x - 273.15) * 1.8 + 491.67",
                    reamur: "(x - 273.15) * 0.8",
                    fahrenheit: "(x - 273.15) * 1.8 + 32",
                    kelvin: "x * 1",
                    celsius: "x - 273.15"
                };
                const formula = getFormula("kelvin", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             celsius(to) {
                const formulaObj = {
                    rankine: "(x * 1.8) + 491.67",
                    reamur: "x * 0.8",
                    fahrenheit: "(x * 1.8) + 32",
                    kelvin: "x + 273.15",
                    celsius: "x * 1"
                };
                const formula = getFormula("celsius", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             "": () => {}
        }

        return resultObj;
    }

    display() {
        super.display();
    }

    displayFormula() {
        super.displayFormula();
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
    new UpArrow(".up-arrow-container").init();
});
import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Converter } from "./utils/converter.js";

class WeightConverter extends Converter {
    constructor() {
        super();
        this.from = "miligram";
        this.to = "miligram";
    }

    init() {
        super.init();
    }
 
    calculate(value) {
        value = parseFloat(value);

        const unitObj = {
            milligram: "mg",
            ounce: "ons",
            gram: "gr",
            pound: "pon",
            kilogram: "kg",
            quintal: "kw",
            ton: "ton"
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
             milligram(to) {
                const formulaObj = {
                    milligram: "x * 1",
                    ounce: "x / 28349.5",
                    gram: "x / 1000",
                    pound: "x / 453592",
                    kilogram: "x / 1000000",
                    quintal: "x / 100000000",
                    ton: "x / 1000000000"
                };
                const formula = getFormula("rankine", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             ounce(to) {
                const formulaObj = {
                    milligram: "x * 28349.5",
                    ounce: "x * 1",
                    gram: "x * 28.3495",
                    pound: "x / 16",
                    kilogram: "x / 35.274",
                    quintal: "x / 3527.4",
                    ton: "x / 35274"
                };
                const formula = getFormula("reamur", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             gram(to) {
                const formulaObj = {
                    milligram: "x * 1000",
                    ounce: "x / 28.3495",
                    gram: "x * 1",
                    pound: "x / 453.592",
                    kilogram: "x / 1000",
                    quintal: "x / 100000",
                    ton: "x / 1000000"
                };
                const formula = getFormula("fahrenheit", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             pound(to) {
                const formulaObj = {
                    milligram: "x * 453592",
                    ounce: "x * 16",
                    gram: "x * 453.592",
                    pound: "x * 1",
                    kilogram: "x / 2.20462",
                    quintal: "x / 220.462",
                    ton: "x / 2204.62"
                };
                const formula = getFormula("kelvin", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             kilogram(to) {
                const formulaObj = {
                    milligram: "x * 1000000",
                    ounce: "x * 35.274",
                    gram: "x * 1000",
                    pound: "x * 2.20462",
                    kilogram: "x * 1",
                    quintal: "x / 100",
                    ton: "x / 1000"
                };
                const formula = getFormula("celsius", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             quintal(to) {
                const formulaObj = {
                    milligram: "",
                    ounce: "",
                    gram: "",
                    pound: "",
                    kilogram: "",
                    quintal: "",
                    ton: ""
                };
                const formula = getFormula("celsius", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             ton(to) {
                const formulaObj = {
                    milligram: "",
                    ounce: "",
                    gram: "",
                    pound: "",
                    kilogram: "",
                    quintal: "",
                    ton: ""
                };
                const formula = getFormula("celsius", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             "": () => {}
        }

        return resultObj;
    }

    convert(value) {
        super.convert(value);
    }

    display() {
        super.display();
    }

    displayFormula() {
        super.displayFormula();
    }
}

const converter = new WeightConverter();

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    // converter.init();
    generateDynamicSiteName("../../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../../json/social-media.json");
});
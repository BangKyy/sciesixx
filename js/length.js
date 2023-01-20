import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Converter } from "./utils/converter.js";
import { UpArrow } from "./partials/float.js";

class LengthConverter extends Converter {
    constructor() {
        super();
        this.from = "nanometer";
        this.to = "nanometer";
    }

    init() {
        super.init();
    }
 
    calculate(value) {
        value = parseFloat(value);

        const unitObj = {
            nanometer: "nm",
            millimeter: "mm",
            centimeter: "cm",
            inch: "inch",
            foot: "ft",
            yard: "yd",
            meter: "m",
            kilometer: "km",
            mile: "mi"
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
             nanometer(to) {
                const formulaObj = {
                    nanometer: "x * 1",
                    millimeter: "x / 1000000",
                    centimeter: "x / 10000000",
                    inch: "x / 2.540000000",
                    foot: "x / 3.04800000000",
                    yard: "x / 9.14400000000",
                    meter: "x / 1000000000",
                    kilometer: "x / 1000000000000",
                    mile: "x / 1.609000000000000"
                };
                const formula = getFormula("nanometer", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },
             
             millimeter(to) {
                const formulaObj = {
                    nanometer: "x * 1000000",
                    millimeter: "x * 1",
                    centimeter: "x / 10",
                    inch: "x / 25.4",
                    foot: "x / 304.8",
                    yard: "x / 914.4",
                    meter: "x / 1000",
                    kilometer: "x / 1000000",
                    mile: "x / 1.609000000"
                };
                const formula = getFormula("millimeter", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             centimeter(to) {
                const formulaObj = {
                    nanometer: "x * 10000000",
                    millimeter: "x * 10",
                    centimeter: "x * 1",
                    inch: "x / 2.54",
                    foot: "x / 30.48",
                    yard: "x / 91.44",
                    meter: "x / 100",
                    kilometer: "x / 100000",
                    mile: "x / 160934"
                };
                const formula = getFormula("centimeter", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             inch(to) {
                const formulaObj = {
                    nanometer: "x * 2.540000000",
                    millimeter: "x * 25.4",
                    centimeter: "x * 2.54",
                    inch: "x * 1",
                    foot: "x / 12",
                    yard: "x / 36",
                    meter: "x / 39.3701",
                    kilometer: "x / 39370.1",
                    mile: "x / 63360"
                };
                const formula = getFormula("inch", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             foot(to) {
                const formulaObj = {
                    nanometer: "x * 3.04800000000",
                    millimeter: "x * 304.8",
                    centimeter: "x * 30.48",
                    inch: "x * 12",
                    foot: "x * 1",
                    yard: "x / 3",
                    meter: "x / 3.28084",
                    kilometer: "x / 3280.84",
                    mile: "x / 5280"
                };
                const formula = getFormula("foot", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             yard(to) {
                const formulaObj = {
                    nanometer: "x * 9.14400000000",
                    millimeter: "x * 914.4",
                    centimeter: "x * 91.44",
                    inch: "x * 36",
                    foot: "x * 3",
                    yard: "x * 1",
                    meter: "x / 1.09361",
                    kilometer: "x / 1093.61",
                    mile: "x / 1760"
                };
                const formula = getFormula("yard", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             meter(to) {
                const formulaObj = {
                    nanometer: "x * 1000000000",
                    millimeter: "x * 1000",
                    centimeter: "x * 100",
                    inch: "x * 39.3701",
                    foot: "x * 3.28084",
                    yard: "x * 1.09361",
                    meter: "x * 1",
                    kilometer: "x / 1000",
                    mile: "x / 1609.34"
                };
                const formula = getFormula("meter", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             kilometer(to) {
                const formulaObj = {
                    nanometer: "x * 1000000000000",
                    millimeter: "x * 1000000",
                    centimeter: "x * 100000",
                    inch: "x * 39370.1",
                    foot: "x * 3280.84",
                    yard: "x * 1093.61",
                    meter: "x * 1000",
                    kilometer: "x * 1",
                    mile: "1 / 1.60934"
                };
                const formula = getFormula("kilometer", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             mile(to) {
                const formulaObj = {
                    nanometer: "x * 1.609000000000000",
                    millimeter: "x * 1.609000000",
                    centimeter: "x * 160934",
                    inch: "x * 63360",
                    foot: "x * 5280",
                    yard: "x * 1760",
                    meter: "x * 1609.34",
                    kilometer: "x * 1.60934",
                    mile: "x * 1"
                };
                const formula = getFormula("mile", formulaObj[to], "x");
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

const converter = new LengthConverter();

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
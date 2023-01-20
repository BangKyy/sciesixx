import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Converter } from "./utils/converter.js";
import { UpArrow } from "./partials/float.js";

class SpeedConverter extends Converter {
    constructor() {
        super();
        this.from = "knot";
        this.to = "knot";
    }

    init() {
        super.init();
    }
 
    calculate(value) {
        value = parseFloat(value);

        const unitObj = {
            knot: "kn",
            mph: "mph",
            ftps: "ftps",
            kmph: "kmph",
            mps: "mps"
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
             knot(to) {
                const formulaObj = {
                    knot: "x * 1",
                    mph: "x * 1.15078",
                    ftps: "x * 1.68781",
                    kmph: "x * 1.852",
                    mps: "x / 1.94384"
                };
                const formula = getFormula("knot", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },
             
             mph(to) {
                const formulaObj = {
                    knot: "x / 1.15078",
                    mph: "x * 1",
                    ftps: "x * 1.46667",
                    kmph: "x * 1.60934",
                    mps: "x / 2.23694"
                };
                const formula = getFormula("mph", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             ftps(to) {
                const formulaObj = {
                    knot: "x / 1.68781",
                    mph: "x / 1.46667",
                    ftps: "x * 1",
                    kmph: "x * 1.09728",
                    mps: "x / 3.28084"
                };
                const formula = getFormula("ftps", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             kmph(to) {
                const formulaObj = {
                    knot: "x / 1.852",
                    mph: "x / 1.60934",
                    ftps: "x / 1.09728",
                    kmph: "x * 1",
                    mps: "x / 3.6"
                };
                const formula = getFormula("kmph", formulaObj[to], "x");
                const result = evaluate(formulaObj[to], value);
                return { formula, result };
             },

             mps(to) {
                const formulaObj = {
                    knot: "x * 1.94384",
                    mph: "x * 2.23694",
                    ftps: "x * 3.28084",
                    kmph: "x * 3.6",
                    mps: "x * 1"
                };
                const formula = getFormula("mps", formulaObj[to], "x");
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

const converter = new SpeedConverter();

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
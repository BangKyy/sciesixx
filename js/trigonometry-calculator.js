import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Calculator } from "./utils/calculator.js";
import { UpArrow } from "./partials/float.js";

class TrigonometryCalculator extends Calculator {
    constructor() {
        super();
        this.angle = "deg";
    }
    
    init() {
        super.init();
        this.setAngleConfig();
        this.historyName = "trigonometry_calculator_history";
    }

    setAngleConfig() {
        let replacements = {};

        // our extended configuration options
        const config = {
            angles: this.angle // 'rad', 'deg', 'grad'
        };

        // create trigonometric functions replacing the input depending on angle config
        const fns1 = ['sin', 'cos', 'tan', 'sec', 'cot', 'csc', 'sinh', 'cosh', 'tanh'];
        fns1.forEach((name) => {
            const fn = math[name]; // the original function

            const fnNumber = (x) => {
                // convert from configured type of angles to radians
                switch (config.angles) {
                    case 'deg':
                    return fn(x / 360 * 2 * Math.PI);
                    case 'grad':
                    return fn(x / 400 * 2 * Math.PI);
                    default:
                    return fn(x);
                }
            }

            // create a typed-function which check the input types
            replacements[name] = math.typed(name, {
                'number': fnNumber,
                'Array | Matrix': (x) => {
                    return math.map(x, fnNumber);
                }
            });
        });

        // create trigonometric functions replacing the output depending on angle config
        const fns2 = ['asin', 'acos', 'atan', 'atan2', 'acot', 'acsc', 'asec'];
        fns2.forEach((name) => { 
            const fn = math[name]; // the original function

            const fnNumber = (x) => {
                const result = fn(x);

                if (typeof result === 'number') {
                    // convert to radians to configured type of angles
                    switch(config.angles) {
                        case 'deg':  return result / 2 / Math.PI * 360;
                        case 'grad': return result / 2 / Math.PI * 400;
                        default: return result;
                    }
                }
                return result;
            }

            // create a typed-function which check the input types
            replacements[name] = math.typed(name, {
                'number': fnNumber,
                'Array | Matrix': (x) => {
                    return math.map(x, fnNumber);
                }
            });
        });

        // import all replacements into math.js, override existing trigonometric functions
        math.import(replacements, {override: true});
    }
}

const calculator = new TrigonometryCalculator();

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    calculator.init();
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
import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { Converter } from "./utils/converter.js";

class TimeConverter extends Converter {
  constructor() {
      super();
      this.from = "millisecond";
      this.to = "millisecond";
  }

  init() {
      super.init();
  }

  calculate(value) {
      value = parseFloat(value);

      const unitObj = {
          millisecond: "ms",
          second: "s",
          minute: "m",
          hour: "h",
          day: "d",
          week: "wk",
          month: "mth",
          year: "yr",
          decade: "dec",
          century: "c"
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
           millisecond(to) {
              const formulaObj = {
                millisecond: "x * 1",
                second: "x / 1000",
                minute: "x / 1000 / 60",
                hour: "x / 1000 / 60 / 60",
                day: "x / 1000 / 60 / 60 / 24",
                week: "x / 1000 / 60 / 60 / 24 / 7",
                month: "x / 1000 / 60 / 60 / 24 / 30",
                year: "x / 1000 / 60 / 60 / 24 / 365",
                decade: "x / 1000 / 60 / 60 / 24 / 365 / 10",
                century: "x / 1000 / 60 / 60 / 24 / 365 / 100"
              };
              const formula = getFormula("millisecond", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },
           
           second(to) {
              const formulaObj = {
                millisecond: "x * 1000",
                second: "x * 1",
                minute: "x / 60",
                hour: "x / 60 / 60",
                day: "x / 60 / 60 / 24",
                week: "x / 60 / 60 / 24 / 7",
                month: "x / 60 / 60 / 24 / 30",
                year: "x / 60 / 60 / 24 / 365",
                decade: "x / 60 / 60 / 24 / 365 / 10",
                century: "x / 60 / 60 / 24 / 365 / 100"
              };
              const formula = getFormula("second", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           minute(to) {
              const formulaObj = {
                millisecond: "x * 60 * 1000",
                second: "x * 60",
                minute: "x * 1",
                hour: "x / 60",
                day: "x / 60 / 24",
                week: "x / 60 / 24 / 7",
                month: "x / 60 / 24 / 30",
                year: "x / 60 / 24 / 365",
                decade: "x / 60 / 24 / 365 / 10",
                century: "x / 60 / 24 / 365 / 100"
              };
              const formula = getFormula("minute", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           hour(to) {
              const formulaObj = {
                millisecond: "x * 60 * 60 * 1000",
                second: "x * 60 * 60",
                minute: "x * 60",
                hour: "x * 1",
                day: "x / 24",
                week: "x / 24 / 7",
                month: "x / 24 / 30",
                year: "x / 24 / 365",
                decade: "x / 24 / 365 / 10",
                century: "x / 24 / 365 / 100"
              };
              const formula = getFormula("hour", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           day(to) {
              const formulaObj = {
                millisecond: "x * 24 * 60 * 60 * 1000",
                second: "x * 24 * 60 * 60",
                minute: "x * 24 * 60",
                hour: "x * 24",
                day: "x * 1",
                week: "x / 7",
                month: "x / 30",
                year: "x / 365",
                decade: "x / 365 / 10",
                century: "x / 365 / 100"
              };
              const formula = getFormula("day", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           week(to) {
              const formulaObj = {
                millisecond: "x * 7 * 24 * 60 * 60 * 1000",
                second: "x * 7 * 24 * 60 * 60",
                minute: "x * 7 * 24 * 60",
                hour: "x * 7 * 24",
                day: "x * 7",
                week: "x * 1",
                month: "x / (30 / 7)",
                year: "x / (30  / 7) / 12",
                decade: "x / (30 / 7) / 12 / 10",
                century: "x / (30 / 7) / 12 / 100"
              };
              const formula = getFormula("week", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           month(to) {
              const formulaObj = {
                millisecond: "x * 30 * 24 * 60 * 60 * 1000",
                second: "x * 30 * 24 * 60 * 60",
                minute: "x * 30 * 24 * 60",
                hour: "x * 30 * 24",
                day: "x * 30",
                week: "x * 30 / 7",
                month: "x * 1",
                year: "x / 12",
                decade: "x / 12 / 10",
                century: "x / 12 / 100"
              };
              const formula = getFormula("month", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           year(to) {
              const formulaObj = {
                millisecond: "x * 365 * 24 * 60 * 60 * 1000",
                second: "x * 365 * 24 * 60 * 60",
                minute: "x * 365 * 24 * 60",
                hour: "x * 365 * 24",
                day: "x * 365",
                week: "x * 365 / 7",
                month: "x * 12",
                year: "x * 1",
                decade: "x / 10",
                century: "x / 100"
              };
              const formula = getFormula("year", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           decade(to) {
              const formulaObj = {
                millisecond: "x * 10 * 365 * 24 * 60 * 60 * 1000",
                second: "x * 10 * 365 * 24 * 60 * 60",
                minute: "x * 10 * 365 * 24 * 60",
                hour: "x * 10 * 365 * 24",
                day: "x * 10 * 365",
                week: "x * 10 * 365 / 7",
                month: "x * 10 * 12",
                year: "x * 10",
                decade: "x * 1",
                century: "x / 10"
              };
              const formula = getFormula("decade", formulaObj[to], "x");
              const result = evaluate(formulaObj[to], value);
              return { formula, result };
           },

           century(to) {
              const formulaObj = {
                millisecond: "x * 100 * 365 * 24 * 60 * 60 * 1000",
                second: "x * 100 * 365 * 24 * 60 * 60",
                minute: "x * 100 * 365 * 24 * 60",
                hour: "x * 100 * 365 * 24",
                day: "x * 100 * 365",
                week: "x * 100 * 365 / 7",
                month: "x * 100 * 12",
                year: "x * 100",
                decade: "x * 10",
                century: "x * 1"
              };
              const formula = getFormula("century", formulaObj[to], "x");
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

const converter = new TimeConverter();

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
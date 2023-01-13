export class Converter {
    static amountInput = document.querySelector("#amount");
    static resultInput = document.querySelector("#result");
    static fromSelect = document.querySelector("#from");
    static toSelect = document.querySelector("#to");
    static formulaContent = document.querySelector(".content");
    static unitObj = {};

    constructor() {
        this.amountInput = Converter.amountInput;
        this.resultInput = Converter.resultInput;
        this.fromSelect = Converter.fromSelect;
        this.toSelect = Converter.toSelect;
        this.formulaContent = Converter.formulaContent;
        this.formula = "";
        this.input = "";
        this.output = "";
    }

    init() {
        this.amountInput.addEventListener("input", (ev) => {
            const value = ev.target.value;
            this.convert(value);
            this.input = value;
            this.display();
        });
        this.fromSelect.addEventListener("change", (ev) => {
            const value = ev.target.value;
            this.from = value.toLowerCase();
            this.convert(this.input);
        });
        this.toSelect.addEventListener("change", (ev) => {
            const value = ev.target.value;
            this.to = value.toLowerCase();
            this.convert(this.input);
        });
    }

    convert(value) {
        const { formula, result } = this.calculate(value)[this.from](this.to);
        this.formula = formula;
        this.output = result;
        this.display();
        this.displayFormula();
    }

    display() {
        this.resultInput.value = this.output;
    }

    displayFormula() {
        this.formulaContent.innerHTML = this.formula;
    }
}
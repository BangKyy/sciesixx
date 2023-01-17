const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

export class Calculator {
    static historyInput = select(".history");
    static historyBtn = select(".history-icon");
    static outputInput = select(".output");
    static clearBtn = select(".clear-btn");
    static deleteBtn = select(".delete-btn");
    static solveBtn = select(".solve-btn");
    static addBtns = selectAll(".add-btn");
    static addBtnInputs = selectAll(".add-btn-input");

    constructor() {
        this.historyInput = Calculator.historyInput;
        this.historyBtn = Calculator.historyBtn;
        this.outputInput = Calculator.outputInput;
        this.clearBtn = Calculator.clearBtn;
        this.deleteBtn = Calculator.deleteBtn;
        this.solveBtn = Calculator.solveBtn;
        this.addBtns = Calculator.addBtns;
        this.addBtnInputs = Calculator.addBtnInputs;
        this.histories = [];
        this.numberList = [];
        this.rawOutput = "";
        this.output = "";
    }

    init() {
        this.clearBtn.addEventListener("click", () => {
            this.clear();
            this.display();
        });
        this.deleteBtn.addEventListener("click", () => {
            this.delete();
            this.display();
        });
        this.solveBtn.addEventListener("click", () => {
            this.solve();
            this.display();
        });
        this.addBtns.forEach((addBtn, i) => {
            addBtn.addEventListener("click", () => {
                const value = this.addBtnInputs[i].value;
                this.add(value);
                this.display();
            });
        });
    }

    toOutput() {
        const value = this.numberList.join("");
        const result = this.changeSymbol(value);
        this.rawOutput = value;
        this.output = result;
    }

    splitOutput() {
        this.numberList = this.output.split("");
    }

    changeSymbol(value) {
        const replacementEntry = {
            "/": "÷",
            "*": "×",
        };
        const outputs = value.split("").map((v) => {
            return v in replacementEntry ? replacementEntry[v] : v;
        });
        return outputs.join("");
    }

    willError(value) {
        if (!(value instanceof Error)) return false;
        this.errorMessage = "Error";
        this.numberList = [];
        return true;
    }

    checkExpr(value) {
        return true;
    }

    evaluate(value) {
        try {
            const evaluated = math.evaluate(value);
            if (isNaN(evaluated) || !isFinite(evaluated)) throw new Error("Error");
            const result = String(Math.round(evaluated * 10e+14) / 10e+14);
            return result;
        } catch (err) {
            console.log("Error");
            return new Error("Error");
        }
    }

    solve() {
        if (!this.output) return;
        const evaluated = this.evaluate(this.rawOutput);
        const willError = this.willError(evaluated);
        if (willError) return this.addError();
        this.output = evaluated;
        this.splitOutput();
    }

    clear() {
        this.numberList = [];
        this.toOutput();
    }
 
    delete() {
        this.numberList.pop();
        this.toOutput();
    }

    add(value) {
        if (!this.checkExpr(value)) return;
        this.numberList.push(value);
        this.toOutput();
    }

    display() {
        this.outputInput.value = this.output;
    }

    addError() {
        this.numberList = [];
        this.output = "Error";
    }
}
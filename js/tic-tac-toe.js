import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";

const score = {
    htmls: document.querySelectorAll(".value-score"),
    red: 0,
    blue: 0,
    add(winner=""){
      if(!winner) return;
      this[winner]++;
      this.display();
    },
    
    display(){
      let scores = [this.red, this.blue];
      this.htmls.forEach((html, i) => {
        html.innerHTML = scores[i];
      });
    }
};
  
const turn = {
    html: document.querySelector(".turn-value"),
    color: {
      red: "#FF3C3C",
      blue: "#3C4FFF"
    },
    options: {
      style: {
        color: ""
      },
      innerHTML: ""
    },
    
    getColor(value=""){
      let color = value === "x" ? this.color.red :
      value === "o" ? this.color.blue : "#000";
      return color;
    },
    
    getOpposite(value=""){
      let opposite = value === "x" ? "o" :
      value === "o" ? "x" : "";
      return opposite;
    },

    getTurnElement(value="") {
      const turn = value === "x" ? `<i class="bi bi-x-lg"></i>` :
      value === "o" ? `<i class="bi bi-circle"></i>` : "";
      return turn;
    },
    
    set(value="") {
      let color = this.getColor(value);
      let turnElement = this.getTurnElement(value);
      this.options.style.color = color
      this.options.innerHTML = turnElement;
      this.display();
    },
    
    change(value="") {
      let opposite = this.getOpposite(value);
      let color = this.getColor(opposite);
      let turnElement = this.getTurnElement(opposite);
      this.options.style.color = color;
      this.options.innerHTML = turnElement;
      this.display();
    },
    
    display() {
      const turnClassName = this.options.style.color === this.color.red ? "x-turn" : "o-turn";
      const oldTurnClassName = turnClassName === "x-turn" ? "o-turn" : "x-turn";
      this.html.classList.replace(oldTurnClassName, turnClassName);
      this.html.innerHTML = this.options.innerHTML;
    }
};
  
  // Main object
const game = {
    squares: document.querySelectorAll(".game"),
    fields: [],
    value: "x",
    winner: "",
    paused: false,
    display(){
      this.squares.forEach((square, i) => {
        let field = this.fields[i];
        square.innerHTML = this.getShape(field);
      });
    },
    
    async displayAlert(title="", text="", icon=""){
      await Swal.fire({
        title,
        text,
        icon
      });
    },
    
    getWinner(value="", fields=[]){
      let filtered = fields.filter((field, i) => {
        return value === field;
      });
      let minimumPassed = filtered.length >= 3;
      if(!(value && minimumPassed)){
        return false;
      }
      
      const getIndexes = (value="", fields=[]) => {
        let output = [];
        fields.forEach((field, i) => {
          if(value === field){
            output.push(i);
          }
        });
        return output;
      };
      
      const includeAll = (indexes=[], array=[]) => {
        for(let i = 0; i < array.length; i++){
          let nums = [];
          for(let j = 0; j < array[i].length; j++){
            let found = indexes.findIndex((n) => {
              return n === array[i][j];
            });
            let bool = found !== -1;
            nums.push(Number(bool));
          }
          let foundZero = nums.findIndex(n => n === 0);
          if(foundZero !== -1){
            continue;
          }
          return true;
        }
        return false;
      };
      
      const checkWinner = (value="") => {
        let winnerPosition = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];
        let indexes = getIndexes(value, fields);
        let isIncludeAll = includeAll(indexes, winnerPosition);
        return isIncludeAll ? this.getColorName(value) : "";
      };
      
      return checkWinner(value)
    },
    
    getColorName(value=""){
      return value === "x" ? "Red" :
      value === "o" ? "Blue" : "";
    },
    
    getShape(value){
      let xShapeClassName = "x-shape";
      let oShapeClassName = "o-shape";
      
      let xShape = `
        <span class="${xShapeClassName}">
          <i class="bi bi-x-lg"></i>
        </span>
      `;
      let oShape = `<span class="${oShapeClassName}">
        <i class="bi bi-circle"></i>
      </span>`;
      
      return value === "x" ? xShape
      : value === "o" ? oShape
      : "";
    },
    
    isDraw(){
      let filteredFields = this.fields.filter((field, i) => {
        return field != undefined;
      });
      return filteredFields.length === 9;
    },
    
    async add(value, position){
      if(this.fields[position] || this.paused){
        return false;
      }
      this.fields[position] = value;
      turn.change(this.value);
      this.display();
      this.winner = this.getWinner(this.value, this.fields);
      if(this.winner){
        this.paused = true;
        score.add(this.winner.toLowerCase());
        await this.displayAlert(`${this.winner} menang!`, "", "success");
        return false;
      }
      if(this.isDraw()){
        this.paused = true;
        await this.displayAlert("Draw!");
        return false;
      }
      this.value = this.value === "x" ? "o" : "x";
    },
    
    reset(){
      if(!this.fields.length) return;
      this.fields = [];
      this.value = `x`;
      this.winner = "";
      this.paused = false;
      turn.set("x");
      this.display();
    },
    
    init(){
      const resetBtn = document.querySelector(".reset-btn");
      
      resetBtn.addEventListener("click", () => {
        this.reset();
      });
      
      this.squares.forEach((square, i) => {
        square.addEventListener("click", () => {
          this.add(this.value, i);
        });
      });
    }
};

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    game.init();
    turn.set("x");
    generateDynamicSiteName("../../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../../json/social-media.json");
});
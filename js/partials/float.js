const select = document.querySelector.bind(document);

export class UpArrow {
    constructor(container, scrollDepth=350) {
        this.container = select(container);
        this.scrollDepth = scrollDepth;
    }

    init() {
        window.addEventListener("scroll", () => {
            this.toggle();
        });
    }

    toggle() {
        window.scrollY >= this.scrollDepth ? this.show() : this.hide();
    }

    show() {
        this.container.style.transform = "translate(0, 0)";
    }
    
    hide() {
        this.container.style.transform = "translate(0, 100%)";
    }
}
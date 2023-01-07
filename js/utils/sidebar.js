export class Sidebar {
    constructor(element, btn, bars) {
        this.element = element;
        this.btn = btn;
        this.bars = bars;
        this.isHidden = null;
    }

    init({ hidden=true }) {
        this.isHidden = hidden;
        this.btn.addEventListener("click", () => {
            this.toggle();
        });
    }

    toggle() {
        switch(this.isHidden) {
            case true: {
                this.show();
                this.isHidden = false;
                break;
            }
            default: {
                this.hide();
                this.isHidden = true;
            }
        }
    }

    show() {
        const translation = "translate(0, 0)";
        const boxShadow = "0 1px 2px 0.1px #00000020";
        const styleBars = [
            { name: "transform", value: "translate(0, 80%) rotate(45deg)" },
            { name: "backgroundColor", value: "#0000" },
            { name: "transform", value: "translate(0, -80%) rotate(-45deg)" }
        ];
        this.element.style.transform = translation;
        this.element.style.boxShadow = boxShadow;
        this.bars.forEach((bar, i) => {
            bar.style[styleBars[i].name] = styleBars[i].value;
        });
    }
    
    hide() {
        const translation = "translate(0, -100%)";
        const boxShadow = "none";
        const styleBars = [
            { name: "transform", value: "translate(0, -150%) rotate(0deg)" },
            { name: "backgroundColor", value: "#011D31" },
            { name: "transform", value: "translate(0, 150%) rotate(0deg)" }
        ];
        this.element.style.transform = translation;
        this.element.style.boxShadow = boxShadow;
        this.bars.forEach((bar, i) => {
            bar.style[styleBars[i].name] = styleBars[i].value;
        });
    }
}

export class SidebarArrow {
    static objects = [];
    static count = 0;

    static collapseAll(indexExcept) {
        SidebarArrow.objects.forEach((obj, i) =>  {
            if (i === indexExcept) return;
            obj.collapse();
        });
    }

    constructor(element, parent, collapsed, collapseSidebar, btnParent, index) {
        SidebarArrow.count += 1;

        this.element = element;
        this.parent = parent;
        this.collapsed = collapsed;
        this.collapseSidebar = collapseSidebar;
        this.btnParent = btnParent;
        this.index = index;
    }
    
    init() {
        this.parent.addEventListener("click", () => {
            this.toggle();
        });
        this.btnParent.addEventListener("click", () => {
            this.collapse();
        });
    }

    toggle() {
        const isCollapsed = this.collapsed.classList.contains("collapsed");
        switch(isCollapsed) {
            case true: {
                this.close();
                break;
            }
            default: {
                this.open();
                this.uncollapseExcept(this.index);
            }
        }
    }

    open() {
        const oldClassName = "bi-caret-down-fill";
        const newClassName = "bi-caret-up-fill";
        this.element.classList.replace(oldClassName, newClassName);
    }
    
    close() {
        const oldClassName = "bi-caret-up-fill";
        const newClassName = "bi-caret-down-fill";
        this.element.classList.replace(oldClassName, newClassName);
    }

    uncollapseExcept(index) {
        SidebarArrow.collapseAll(index);
    }

    collapse() {
        this.collapsed.classList.add("collapsed");
        this.collapsed.setAttribute("aria-expanded", "false");
        this.collapseSidebar.classList.remove("show");
        this.close();
    }
}
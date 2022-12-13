export class TogglePassword {
    constructor(input, btn) {
        this.input = input;
        this.btn = btn;
        this.isHidden = true;
        this.eyeOpen = `<i class="bi bi-eye-slash"></i>`;
        this.eyeClosed = `<i class="bi bi-eye"></i>`;
    }

    init() {
        this.btn?.addEventListener("click", () => {
            this.toggle();
        });
    }

    toggle() {
        this.isHidden ? this.show() : this.hide();
        this.isHidden = !this.isHidden;
    }

    show() {
        this.input.type = "text";
        this.btn.innerHTML = this.eyeClosed;
    }
    
    hide() {
        this.input.type = "password";
        this.btn.innerHTML = this.eyeOpen;
    }
}
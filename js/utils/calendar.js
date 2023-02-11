const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

class Task {
    constructor(name="", description="", tag="", date="", isStarred=false) {
        this.name = name;
        this.description = description;
        this.tag = tag;
        this.date = date;
        this.isStarred = isStarred;
    }

    toElement() {
        const iconClassLists = ["list-star-icon", "bi"];
        iconClassLists.push(this.isStarred ? "bi-star-fill" : "bi-star");
        const element = `
            <div class="list">
                <div class="list-dot-container">
                    <div class="list-dot"></div>
                </div>
                <div class="list-text-container">
                    <h5 class="list-title">${this.name}</h5>
                    <div class="list-text">${this.description}</div>
                </div>
                <div class="list-star-container">
                    <i class="${iconClassLists.join(" ")}"></i>
                </div>
            </div>
        `;
        return element;
    }
}

class NumberContent {
    constructor(number, day=0, isCurrent=true, hasTask=false) {
        this.number = number;
        this.day = day;
        this.isCurrent = isCurrent;
        this.hasTask = hasTask;
    }

    toElement() {
        const classLists = ["number-content"];
        const taskClassLists = ["number-mark"];
        this.isCurrent ? classLists.push("number-content-enabled") : classLists.push("number-content-disabled");
        this.hasTask ? taskClassLists.push("number-mark-active") : 0;
        const element = `
            <div class="${classLists.join(" ")}">
                <div class="number-text">${this.number}</div>
                <div class="${taskClassLists.join(" ")}"></div>
            </div>
        `;
        return element;
    }
}

export class Calendar {
    static #months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    static #days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    static prevBtn = select(".left-top-arrow-icon-1");
    static nextBtn = select(".left-top-arrow-icon-2");
    static leftMonthElement = select(".left-top-month-text");
    static rightMonthElement = select(".right-top-month-text");
    static leftYearElement = select(".left-top-year-text");
    static rightYearElement = select(".right-top-year-text");
    static rightDayElement = select(".right-top-day");
    static rightDateElement = select(".right-top-date-text");
    static gridContainer = select(".number-grid-container");
    static numberContentElements = selectAll(".number-content-enabled");
    static listContainer = select(".list-container");

    constructor() {
        this.prevBtn = Calendar.prevBtn;
        this.nextBtn = Calendar.nextBtn;
        this.leftMonthElement = Calendar.leftMonthElement;
        this.rightMonthElement = Calendar.rightMonthElement;
        this.leftYearElement = Calendar.leftYearElement;
        this.rightYearElement = Calendar.rightYearElement;
        this.rightDayElement = Calendar.rightDayElement;
        this.rightDateElement = Calendar.rightDateElement;
        this.gridContainer = Calendar.gridContainer;
        this.numberContentElements = Calendar.numberContentElements;
        this.listContainer = Calendar.listContainer;
        this.currentDate = new Date();
        this.date = new Date();
        this.numberContents = [];
        this.starredTasks = [];
        this.tasks = [];
        this.elementString = "";
        this.starredTaskElementString = "";
        this.taskElementString = "";
    }
    
    async init() {
        this.generateStarredTasks();
        await this.fetchTasks();
        this.generateDates(this.currentDate);
        this.formatNumberContents();
        this.formatTasks();
        this.displayCalendarDate();
        this.displayTaskDate(this.date, this.date.getDate());
        this.display();
        this.formatStarredTasks();
        this.displayStarredTask();
        this.initDom();
        this.initDomEvent();
        this.initEvent();
        this.initObject();
        console.log(this.starredTasks)
    }

    initDom() {
        this.numberContentElements = selectAll(".number-content-enabled");
    }

    initDomEvent() {
        this.numberContentElements.forEach((element) => {
            element.addEventListener("click", () => {
                this.numberContentElements.forEach((subElement) => {
                    subElement.classList.remove("number-content-active");
                });
            });
        });
    }

    initEvent() {
        this.prevBtn.addEventListener("click", () => {
            this.nextMonth(-1);
            this.generateDates(this.date);
            this.formatNumberContents();
            this.displayCalendarDate();
            this.display();
            this.initDom();
            this.initDomEvent();
            this.initObject();
        });
        this.nextBtn.addEventListener("click", () => {
            this.nextMonth(1);
            this.generateDates(this.date);
            this.formatNumberContents();
            this.displayCalendarDate();
            this.display();
            this.initDom();
            this.initDomEvent();
            this.initObject();
        });
    }

    initObject() {
        const numberContents = [...this.numberContentElements].map((v, i) => {
            const isActive = NumberContentEnabled.isActiveNumberContent(i + 1, this.date);
            return new NumberContentEnabled(i, this.date, isActive);
        });
        NumberContentEnabled.setObjects(...numberContents);
        NumberContentEnabled.setTasks(...this.tasks);
        NumberContentEnabled.objects.forEach((obj) => {
            obj.init();
        });
    }

    async fetchTasks() {
        try {
            const rawTasks = await fetch(`../../rest/calendar-task.php`);
            const tasks = await rawTasks.json();
            const output = tasks.map((t) => new Task(t.name, t.description, t.tag, t.date, false));
            this.tasks = output;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan");
            console.log(err);
        }
    }

    addStarredTaskMethod(value) {
        const toElement = new Task().toElement.bind(value);
        value.toElement = toElement;
    }

    getMaxDate(value=new Date()) {
        const date = new Date(value.getTime());
        date.setDate(1);
        let output = 0;
        while (date.getDate() > output) {
            if (output >= 31) return 31;
            output++;
            date.setDate(date.getDate() + 1);
        }
        return output;
    }

    getStarredTasks() {
        const starredTasks = JSON.parse(localStorage.getItem("sciesixx-calendar-task-starred") ?? "[]");
        starredTasks.forEach((v) => this.addStarredTaskMethod(v));
        return starredTasks;
    }

    setStarredTasks(...value) {
        const starredTaskString = JSON.stringify([...value]);
        localStorage.setItem("sciesixx-calendar-task-starred", starredTaskString);
    }

    hasTaskDate(value=this.date, number) {
        const date = new Date(value.getTime());
        const tasks = this.tasks.find((task) => {
            const taskDate = new Date(task.date);
            const equalDate = taskDate.getDate() === number;
            const equalMonth = taskDate.getMonth() === date.getMonth();
            const equalYear = taskDate.getFullYear() === date.getFullYear();
            return equalDate && equalMonth && equalYear;
        });
        return tasks;
    }

    generatePastDates(value=this.date, output) {
        const date = new Date(value.getTime());
        date.setMonth(date.getMonth() - 1);
        const maxDate = this.getMaxDate(date);
        const numberContents = Object.assign([], output);
        const nullLength = numberContents.findIndex((n) => n !== null);
        const maxNullIndex = nullLength - 1;
        const firstActiveDay = numberContents[nullLength].day;
        const pastDates = Array(nullLength).fill(maxDate - maxNullIndex).map((v, i) => v + i);
        const pastDays = Array(nullLength).fill((firstActiveDay + 7 - nullLength) % 7).map((v, i) => v + i);
        const pastDateObjs = pastDates.map((v, i) => {
            const hasTask = this.hasTaskDate(date, maxDate - (maxNullIndex - i));
            return new NumberContent(v, pastDays[i], false, hasTask);
        });
        output.splice(0, pastDateObjs.length, ...pastDateObjs);
    }

    generateFutureDates(value=this.date, output) {
        const date = new Date(value.getTime());
        date.setMonth(date.getMonth() + 1);
        output.reverse();
        const numberContents = Object.assign([], output);
        const nullLength = numberContents.findIndex((n) => n !== null);
        const lastActiveDay = numberContents[nullLength].day;
        const futureDates = Array(nullLength).fill(nullLength).map((v, i) => v - i);
        const futureDays = Array(nullLength).fill(lastActiveDay + nullLength).map((v, i) => (v + 7 - i) % 7);
        const futureDaysObjs = futureDates.map((v, i) => {
            const hasTask = this.hasTaskDate(date, nullLength - i);
            return new NumberContent(v, futureDays[i], false, hasTask);
        });
        output.splice(0, futureDaysObjs.length, ...futureDaysObjs);
        output.reverse();
    }

    generateDates(value=this.date) {
        const date = new Date(value.getTime());
        date.setDate(1);
        const beginDay = date.getDay();
        const maxDate = this.getMaxDate(date);
        const output = new Array(42).fill(null);
        for (let i = 0; i < maxDate; i++) {
            let tempIndex = beginDay + i;
            let tempDay = tempIndex % 7;
            const hasTask = this.hasTaskDate(value, i + 1);
            output[tempIndex] = new NumberContent(i + 1, tempDay, true, hasTask);
        }
        this.generatePastDates(value, output);
        this.generateFutureDates(value, output);
        this.numberContents = output;
    }

    generateStarredTasks() {
        const starredTasks = this.getStarredTasks();
        this.starredTasks = starredTasks;
    }

    saveStarredTasks() {
        const starredTaskString = JSON.stringify(this.starredTasks);
        localStorage.setItem("sciesixx-calendar-task-starred", starredTaskString);
    }

    nextMonth(step) {
        this.date.setMonth(this.date.getMonth() + step);
    }

    formatNumberContents() {
        this.elementString = this.numberContents.map((numberContent) => {
            return numberContent !== null ? numberContent.toElement() : "";
        }).join("");
    }

    formatStarredTasks() {
        this.starredTaskElementString = this.starredTasks.map((task) => {
            return task.toElement();
        }).join("");
    }

    specifyTasks(value=this.date, number) {
        const date = new Date(value.getTime());
        const filteredTasks = this.tasks.filter((task) => {
            const taskDate = new Date(task.date);
            const equalDate = taskDate.getDate() === number;
            const equalMonth = taskDate.getMonth() === date.getMonth();
            const equalYear = taskDate.getFullYear() === date.getFullYear();
            return equalDate && equalMonth && equalYear;
        });
        console.log(filteredTasks);
    }
    
    formatTasks() {
        this.taskElementString = this.tasks.map((task) => {
            return task.toElement();
        }).join("");
    }

    async showError(message, title="Error", icon="error") {
        await Swal.fire(title, message, icon);
    }

    displayStarredTask() {
        this.listContainer.innerHTML = this.starredTaskElementString;
    }
    
    displayTask() {
        this.listContainer.innerHTML = this.taskElementString;
    }

    displayCalendarDate() {
        const month = Calendar.#months[this.date.getMonth()];
        const year = String(this.date.getFullYear());
        this.leftMonthElement.innerHTML = month;
        this.leftYearElement.innerHTML = year;
    }

    displayTaskDate(value=this.date, number) {
        const date = new Date(value.getTime());
        date.setDate(number);
        const day = Calendar.#days[date.getDay()];
        const month = Calendar.#months[date.getMonth()];
        const year = String(date.getFullYear());
        this.rightDayElement.innerHTML = day;
        this.rightDateElement.innerHTML = number;
        this.rightMonthElement.innerHTML = month;
        this.rightYearElement.innerHTML = year;
    }

    display() {
        this.gridContainer.innerHTML = this.elementString;
    }
}

class Star extends Calendar {
    static starredTasks = [];

    static getStarredTasks() {
        return JSON.parse(localStorage.getItem("sciesixx-calendar-task-starred") ?? "[]");
    }

    static regenerateStarredTasks() {
        Star.starredTasks = Star.getStarredTasks();
    }

    constructor(index, date, data={}, isStarred=false) {
        super();
        this.index = index;
        this.date = date;
        this.data = data;
        this.isStarred = isStarred;
        this.isFilled = isStarred;
    }

    init() {
        this.initDom();
        this.initEvent();
    }

    initDom() {
        this.element = selectAll(".list-star-icon")[this.index];
        console.log(this.index);
    }

    initEvent() {
        this.element?.addEventListener("click", () => {
            this.toggleStar();
        });
    }

    toggleStar() {
        if (this.isFilled) {
            this.unsave();
            this.unstar();
            this.isFilled = false;
            return;
        }
        this.save();
        this.star();
        this.isFilled = true;
    }

    save() {
        this.data.isStarred = true;
        Star.starredTasks.push(this.data);
        this.starredTasks = [...Star.starredTasks];
        super.setStarredTasks(...this.starredTasks);
    }
    
    unsave() {
        Star.starredTasks = Star.starredTasks.filter((task) => {
            return task.tag !== this.data.tag;
        });
        this.starredTasks = [...Star.starredTasks];
        super.setStarredTasks(...this.starredTasks);
    }

    star() {
        const oldClassName = "bi-star";
        const newClassName = "bi-star-fill";
        this.element.classList.remove(oldClassName);
        this.element.classList.add(newClassName);
    }
    
    unstar() {
        const oldClassName = "bi-star-fill";
        const newClassName = "bi-star";
        this.element.classList.remove(oldClassName);
        this.element.classList.add(newClassName);
    }
}

class NumberContentEnabled extends Calendar {
    static objects = [];
    static tasks = [];
    static starredTasks = [];
    static activeNumberDateString = null;

    static isActiveNumberContent(number, date) {
        const pastDateString = NumberContentEnabled.activeNumberDateString;
        const pastDate = new Date(pastDateString);
        const isEqualDate = number === pastDate.getDate();
        const isEqualMonth = date.getMonth() === pastDate.getMonth();
        const isEqualYear = date.getFullYear() === pastDate.getFullYear();
        return isEqualDate && isEqualMonth && isEqualYear;
    }

    static setObjects(...values) {
        NumberContentEnabled.objects = [...values];
    }

    static setStarredTasks(...values) {
        NumberContentEnabled.starredTasks = [...values];
    }

    static setTasks(...values) {
        NumberContentEnabled.tasks = [...values];
    }

    static saveActiveNumberContent(number, date) {
        const activeNumberDate = new Date();
        activeNumberDate.setDate(number);
        activeNumberDate.setMonth(date.getMonth());
        activeNumberDate.setFullYear(date.getFullYear());
        const dateString = activeNumberDate.toString();
        NumberContentEnabled.activeNumberDateString = dateString;
    }

    static removeActiveNumberContent() {
        NumberContentEnabled.activeNumberDateString = null;
    }

    static toggleActiveObject(index, shouldActive) {
        NumberContentEnabled.objects.forEach((obj) => {
            obj.isActive = false;
        });
        NumberContentEnabled.objects[index].isActive = shouldActive;
    }

    constructor(index, date, isActive=false) {
        super();
        this.index = index;
        this.date = date;
        this.isActive = isActive;
        this.element = selectAll(".number-content-enabled")[index];
        this.newStarredTasks = [];
        this.newTasks = [];
        this.specifiedTasks = [];
        this.specifiedTaskElementString = "";
    }

    init() {
        this.mightActivate();
        this.putStarredTasks();
        this.specifyStarredTasks();
        this.initEvent();
        this.emitStarredStars();
    }

    initEvent() {
        this.element.addEventListener("click", () => {
            this.toggleActive();
        });
    }

    toggleActive() {
        if (this.isActive) {
            this.deactivate();
            return;
        }
        this.activate();
    }

    mightActivate() {
        if (!this.isActive) return;
        this.activate();
        this.isActive = true;
    }

    activate() {
        NumberContentEnabled.toggleActiveObject(this.index, !this.isActive);
        NumberContentEnabled.saveActiveNumberContent(this.index + 1, this.date);
        super.displayTaskDate(this.date, this.index + 1);
        this.specifyTasks(this.date, this.index + 1);
        this.formatSpecifiedTasks();
        this.displaySpecifiedTask();
        this.putStarredTasks();
        this.emitSpecifiedStars();
        this.element.classList.add("number-content-active");
        // this.specifiedTasks.length ? this.element.classList.add("number-content-task-active") : 0;
    }

    deactivate() {
        NumberContentEnabled.removeActiveNumberContent();
        super.generateStarredTasks();
        super.formatStarredTasks();
        this.putStarredTasks();
        super.displayStarredTask();
        this.emitStarredStars();
        this.element.classList.remove("number-content-active", "number-content-task-active");
        this.isActive = false;
    }

    putStarredTasks() {
        const starredTasks = super.getStarredTasks();
        const newTasks = NumberContentEnabled.tasks.map((v) => {
            const output = Object.assign(v);
            output.isStarred = false;
            starredTasks.forEach((w) => {
                if (w.tag !== v.tag) return;
                output.isStarred = true;
            });
            return output;
        });
        NumberContentEnabled.setTasks(...newTasks);
        this.newTasks = newTasks;
    }

    specifyStarredTasks() {
        const starredTasks = this.newTasks.filter((task) => {
            return task.isStarred;
        });
        this.newStarredTasks = starredTasks;
    }

    specifyTasks(value=this.date, number) {
        const date = new Date(value.getTime());
        const specifiedTasks = NumberContentEnabled.tasks.filter((task) => {
            const taskDate = new Date(task.date);
            const equalDate = taskDate.getDate() === number;
            const equalMonth = taskDate.getMonth() === date.getMonth();
            const equalYear = taskDate.getFullYear() === date.getFullYear();
            return equalDate && equalMonth && equalYear;
        });
        this.specifiedTasks = specifiedTasks;
    }

    emitStarredStars() {
        Star.regenerateStarredTasks();
        const starredStars = Star.starredTasks.map((v, i) => {
            return new Star(i, this.date, v, true);
        });
        starredStars.forEach((star) => {
            star.init();
        });
    }

    emitSpecifiedStars() {
        Star.regenerateStarredTasks();
        const specifiedStars = this.specifiedTasks.map((v, i) => {
            return new Star(i, this.date, v, v.isStarred);
        });
        specifiedStars.forEach((star) => {
            star.init();
        });
    }

    formatSpecifiedTasks() {
        const taskElements = this.specifiedTasks.map((task) => {
            return task.toElement();
        })
        .map((task) => task.trim());
        const taskElementString = taskElements.join("");
        this.specifiedTaskElementString = taskElementString;
    }

    displaySpecifiedTask() {
        this.listContainer.innerHTML = this.specifiedTaskElementString;
    }
}
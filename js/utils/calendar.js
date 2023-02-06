const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

class Task {
    constructor(name="", description="", date="", isStarred=false) {
        this.name = name;
        this.description = description;
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
        this.display();
        this.displayStarredTask();
        // this.displayTask();
        this.initDom();
        this.initEvent();
        this.initObject();
    }

    initDom() {
        this.numberContentElements = selectAll(".number-content-enabled");
    }

    initEvent() {
        this.prevBtn.addEventListener("click", () => {
            this.nextMonth(-1);
            this.generateDates(this.date);
            this.formatNumberContents();
            this.displayCalendarDate();
            this.display();
        });
        this.nextBtn.addEventListener("click", () => {
            this.nextMonth(1);
            this.generateDates(this.date);
            this.formatNumberContents();
            this.displayCalendarDate();
            this.display();
        });
    }

    initObject() {
        const numberContents = [...this.numberContentElements].map((v, i) => new NumberContentEnabled(i));
        NumberContentEnabled.setObjects(...numberContents);
        NumberContentEnabled.objects.forEach((obj) => {
            obj.init();
        });
    }

    async fetchTasks() {
        try {
            const rawTasks = await fetch(`../../rest/calendar-task.php`);
            const tasks = await rawTasks.json();
            const output = tasks.map((t) => new Task(t.name, t.description, t.date, false));
            this.tasks = output;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan");
            console.log(err);
        }
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
        console.log(this.tasks);
    }

    generateStarredTasks() {
        const starredTasks = JSON.parse(localStorage.getItem("sciesixx-calendar-task-starred") ?? "[]");
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

    formatTasks() {
        this.taskElementString = this.tasks.map((task) => {
            return task.toElement();
        }).join("");
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

    display() {
        this.gridContainer.innerHTML = this.elementString;
    }
}

class NumberContentEnabled extends Calendar {
    static objects = [];

    static setObjects(...values) {
        NumberContentEnabled.objects.length = 0;
        NumberContentEnabled.objects.push(...values);
    }

    static toggleActiveObject(index) {
        NumberContentEnabled.objects.forEach((obj) => {
            obj.isActive = false;
        });
        NumberContentEnabled.objects[index].isActive = true;
    }

    constructor(index) {
        super();
        this.index = index;
        this.element = selectAll(".number-content-enabled")[index];
        this.isActive = false;
    }

    init() {
        this.initEvent();
    }

    initEvent() {
        this.element.addEventListener("click", () => {
            console.log(this.index);
        });
    }

    displayTask() {

    }
}
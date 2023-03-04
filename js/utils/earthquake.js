const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

export class Earthquake {
    static shakemapElement = select(".shakemap");
    static dateTimeElement = select(".parameter-datetime");
    static clockElement = select(".parameter-clock");
    static paramElements = selectAll(".parameter-text-value");
    static mmiDescElement = select(".mmi-description");
    static mmiBoxContainer = select(".mmi-box-container");
    static quakeContainers = selectAll(".quake-container");
    static quakeTexts = selectAll(".quake-text");
    static rowContainer = select(".earthquake-table tbody");

    constructor() {
        this.shakemapElement = Earthquake.shakemapElement;
        this.dateTimeElement = Earthquake.dateTimeElement;
        this.clockElement = Earthquake.clockElement;
        this.paramElements = Earthquake.paramElements;
        this.mmiDescElement = Earthquake.mmiDescElement;
        this.mmiBoxContainer = Earthquake.mmiBoxContainer;
        this.quakeContainers = Earthquake.quakeContainers;
        this.quakeTexts = Earthquake.quakeTexts;
        this.rowContainer = Earthquake.rowContainer;
        this.data = {};
        this.history = [];
        this.m5History = [];
        this.rowElementString = "";
        this.m5RowElementString = "";
        this.isM5Mode = false;
    }

    async init() {
        await this.fetchData();
        console.log(this.data);
    }

    async fetchAllData() {
        try {
            const pendingData = fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
            const pendingM5History = fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json");
            const pendingHistory = fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json");
            const [rawData, rawM5History, rawHistory] = await Promise.all([pendingData, pendingM5History, pendingHistory]);
            const [data, m5History, history] = await Promise.all([rawData.json(), rawM5History.json(), rawHistory.json()]);
            console.log(data);
        } catch (err) {
            await this.showError("Telah terjadi kesalahan pada saat menampilkan data");
            console.log(err);
        }

    }

    async fetchData() {
        try {
            const rawData = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
            const data = await rawData.json();
            this.data = data;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan pada saat menampilkan data");
            console.log(err);
        }

    }

    async fetchHistory() {
        try {
            const rawHistory = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json");
            const history = await rawHistory.json();
            this.history = history;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan pada saat menampilkan data");
            console.log(err);
        }
    }

    async fetchM5History() {
        try {
            const rawM5History = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json");
            const m5History = await rawM5History.json();
            this.m5History = m5History;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan pada saat menampilkan data");
            console.log(err);
        }
    }

    async showError(message, title="Error", icon="error") {
        await Swal.fire(title, message, icon);
    }

    display() {

    }

    displayM5() {

    }
}
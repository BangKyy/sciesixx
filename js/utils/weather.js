export class Weather {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.currentData = {};
        this.data = {};
        this.apiKey = "";
    }

    async init() {
        await this.configApiKey();
        await this.requestCoord();
        await this.fetchCurrentData();
        this.displayCurrent();
        console.log(this.currentData);
    }

    async configApiKey() {
        try {
            const filePath = "../../../env-json/weather.json";
            const rawConfig = await fetch(filePath);
            const config = await rawConfig.json();
            this.apiKey = config.apiKey;
        } catch (err) {
            await this.showError(err.message);
        }
    }

    getCoord() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("Browser anda tidak mendukung pada saat menampilkan cuaca"));
            navigator.geolocation.getCurrentPosition((position) => {
                const output = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                resolve(output);
            }, (err) => {
                reject(err);
            });
        });
    }

    async requestCoord() {
        try {
            const coord = await this.getCoord();
            this.latitude = coord.latitude;
            this.longitude = coord.longitude;
        } catch (err) {
            await this.showError("Terjadi kesalahan");
        }
    }

    async fetchCurrentData() {
        try {
            const rawCurrentData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&appid=${this.apiKey}`);
            const currentData = await rawCurrentData.json();
            this.currentData = currentData;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan pada saat menampilkan cuaca di lokasi anda");
        }
    }

    async fetchData(city) {
        try {
            const rawData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`);
            const data = await rawData.json();
            this.data = data;
        } catch (err) {
            await this.showError("Lokasi tidak dapat ditemukan");
        }
    }

    search() {

    }

    async showError(message) {
        await Swal.fire("Error", value, "error");
    }

    displayCurrent() {

    }

    display() {

    }
}
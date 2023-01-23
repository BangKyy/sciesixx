const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

export class Weather {
    static cityElement = select(".city-name");
    static todayIcon = select(".weather-today-icon");
    static temperatureElement = select(".weather-temperature");
    static timeDayElement = select(".weather-time-day");
    static timeHourElement = select(".weather-time-hour");
    static conditionIcon = select(".weather-condition-icon");
    static conditionText = select(".weather-condition-text");

    static pressureIndicator = select(".pressure-indicator");
    static humidityIndicator = select(".humidity-indicator");
    static airIndicator = select(".air-indicator");

    static pressureElement = select(".pressure-number");
    static windElement = select(".wind-number");
    static windFooter = select(".wind-footer");
    static sunriseElement = select(".sunrise-number");
    static sunsetElement = select(".sunset-number");
    static humidityElement = select(".humidity-number");
    static humidityFooter = select(".humidity-footer");
    static visibilityElement = select(".visibility-number");
    static visibilityFooter = select(".visibility-footer");
    static airElement = select(".air-number");
    static airFooter = select(".air-footer");

    constructor() {
        this.cityElement = Weather.cityElement;
        this.todayIcon = Weather.todayIcon;
        this.temperatureElement = Weather.temperatureElement;
        this.timeDayElement = Weather.timeDayElement;
        this.timeHourElement = Weather.timeHourElement;
        this.conditionIcon = Weather.conditionIcon;
        this.conditionText = Weather.conditionText;

        this.pressureIndicator = Weather.pressureIndicator;
        this.humidityIndicator = Weather.humidityIndicator;
        this.airIndicator = Weather.airIndicator;

        this.pressureElement = Weather.pressureElement;
        this.windElement = Weather.windElement;
        this.windFooter = Weather.windFooter;
        this.sunriseElement = Weather.sunriseElement;
        this.sunsetElement = Weather.sunsetElement;
        this.humidityElement = Weather.humidityElement;
        this.humidityFooter = Weather.humidityFooter;
        this.visibilityElement = Weather.visibilityElement;
        this.visibilityFooter = Weather.visibilityFooter;
        this.airElement = Weather.airElement;
        this.airFooter = Weather.airFooter;

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
            const errorMessage = err.PERMISSION_DENIED ? "Mohon izinkan akses lokasi" : "Telah terjadi kesalahan";
            await this.showError(errorMessage, "Maaf");
        }
    }

    async fetchCurrentData() {
        if (!(this.latitude && this.longitude)) return;
        try {
            const rawCurrentData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&lang=id&appid=${this.apiKey}`);
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

    async showError(message, title="Error", icon="error") {
        await Swal.fire(title, message, icon);
    }

    displayCityName(value=this.data) {
        const cityName = value?.name;
        if (!cityName) return this.cityElement.innerHTML = "N/A";
        this.cityElement.innerHTML = cityName;
    }

    displayTodayIcon(value=this.data) {

    }

    displayTodayTime() {
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const leadZero = (number) => number < 10 ? "0" + String(number) : String(number);
        const date = new Date();
        const day = `${days[date.getDay()]}, `;
        const clock = `${leadZero(date.getHours())}:${leadZero(date.getMinutes())}`;
        this.timeDayElement.innerHTML = day;
        this.timeHourElement.innerHTML = clock;
    }

    displayTemperature(value=this.data) {
        const temperature = value?.main?.temp;
        if (!temperature) return this.temperatureElement.innerHTML = "N/A";
        const output = `${Math.round(temperature - 273.15)}&deg;C`;
        this.temperatureElement.innerHTML = output;
    }

    displayCondition(value=this.data) {
        const condition = value?.weather[0]?.description;
        if (!condition) {
            this.conditionIcon.src = "../../../images/weather/weather-haze.svg";
            this.conditionText = "N/A";
            return;
        }
        const toCapitalize = (string) => string.split(" ").map(s => s[0].toUpperCase() + s.substr(1, s.length - 1)).join(" ");
        // this.condition.src = 
        this.conditionText.innerHTML = toCapitalize(condition);
    }

    displayPressure(value=this.data) {
        const pressure = value?.main?.pressure;
        if (!pressure) return this.pressureElement = "N/A";
        const pressureAtm = Math.round(pressure / 1013.25 * 100) / 100;
        this.pressureElement.innerHTML = pressureAtm;
    }

    displayPressureIndicator(value=this.data) {
        const pressure = value?.main?.pressure;
        if (!pressure) return this.pressureIndicator.style.height = `calc((0 / 100) * 140px + 12px)`;
        const negativeToZero = (number) => number < 0 ? 0 : number;
        const pressureAtm = Math.round(pressure / 1013.25 * 100) / 100;
        const maxPressureAtm = 1.07;
        const minPressureAtm = 0.93;
        const diffPressureAtm = Math.round((maxPressureAtm - minPressureAtm) * 100) / 100;
        const diffCurrentPressureAtm = negativeToZero(Math.round((pressureAtm - minPressureAtm) * 100) / 100);
        const percent = Math.round((diffCurrentPressureAtm / diffPressureAtm) * 100);
        this.pressureIndicator.style.height = `calc((${percent} / 100) * 140px + 12px)`;
    }

    displayWind(value=this.data) {
        const wind = value?.wind?.speed;
        if (!wind) return this.windElement.innerHTML = "N/A";
        const roundedWind = Math.round(wind * 10) / 10;
        this.windElement.innerHTML = roundedWind;
    }

    displayWindDirection(value=this.data) {
        const degree = value?.wind?.deg;
        if (!degree) return this.windFooter.innerHTML = "N/A";
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        /*
            0 -> N = 0 deg
            1 -> NNE = (1-44) deg
            2 -> NE = 45 deg
            3 -> ENE = (46-89) deg
            4 -> E = 90 deg
            ....
        */
       this.windFooter.innerHTML = "N";
    }

    displaySunDate(value=this.data) {
        const sunriseMs = value?.sys?.sunrise;
        const sunsetMs = value?.sys?.sunset;
        if (!(sunriseMs && sunsetMs)) {
            this.sunriseElement.innerHTML = "N/A";
            this.sunsetElement.innerHTML = "N/A";
            return;
        };
        const leadZero = (number) => number < 10 ? "0" + String(number) : String(number);
        const sunriseDate = new Date(sunriseMs);
        const sunsetDate = new Date(sunsetMs);
        const sunriseHour = leadZero(sunriseDate.getHours());
        const sunriseMinute = leadZero(sunriseDate.getMinutes());
        const sunsetHour = leadZero(sunsetDate.getHours());
        const sunsetMinute = leadZero(sunsetDate.getMinutes());
        const sunrise = `${sunriseHour}:${sunriseMinute}`;
        const sunset = `${sunsetHour}:${sunsetMinute}`;
        this.sunriseElement.innerHTML = sunrise;
        this.sunsetElement.innerHTML = sunset;
    }

    displayHumidity(value=this.data) {
        const humidity = value?.main?.humidity;
        if (!humidity) return this.humidityElement.innerHTML = "N/A";
        const output = `${humidity}%`;
        this.humidityElement.innerHTML = output;
    }

    displayHumidityFooter(value=this.data) {
        this.humidityFooter.innerHTML = "Berbahaya";
    }

    displayHumidityIndicator(value=this.data) {
        const humidity = value?.main?.humidity;
        const height = humidity ?? 0;
        this.humidityIndicator.style.height = `calc((${height} / 100) * 98px + 22px)`;
    }

    displayVisibility(value=this.data) {
        const visibility = value?.visibility;
        if (!visibility) return this.visibilityElement = "N/A";
        const visibilityKm = Math.round(visibility / 1000 * 10) / 10;
        this.visibilityElement.innerHTML = visibilityKm;
    }
    
    displayVisibilityFooter(value=this.data) {
        this.visibilityElement = "Lembut";
    }

    displayAir(value=this.data) {
        this.airElement.innerHTML = "N/A";
    }
    
    displayAirIndicator(value=this.data) {
        this.airIndicator.style.height = `calc((0 / 100) * 98px + 22px)`;
    }

    displayAirFooter(value=this.data) {
        this.airFooter.innerHTML = "N/A";
    }

    displayAll(value=this.data) {
        this.displayCityName(value);
        this.displayTodayIcon(value);
        this.displayTemperature(value);
        this.displayTodayTime(value);
        this.displayCondition(value);
        this.displayPressure(value);
        this.displayPressureIndicator(value);
        this.displayWind(value);
        this.displayWindDirection(value);
        this.displaySunDate(value);
        this.displayHumidity(value);
        this.displayHumidityIndicator(value);
        this.displayHumidityFooter(value);
        this.displayVisibility(value);
        this.displayVisibilityFooter(value);
        this.displayAir(value);
        this.displayAirIndicator(value);
        this.displayAirFooter(value);
    }

    displayCurrent() {
        this.displayAll(this.currentData);
    }

    display() {
        this.displayAll(this.data);
    }
}
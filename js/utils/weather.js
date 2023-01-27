const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

export class Weather {
    static searchElement = select(".search");
    static searchCloseBtn = select(".search-close-icon");
    static cityElement = select(".city-name");
    static todayIcon = select(".weather-today-icon");
    static temperatureElement = select(".weather-temperature");
    static timeDayElement = select(".weather-time-day");
    static timeHourElement = select(".weather-time-hour");
    static conditionIcon = select(".weather-condition-icon");
    static conditionText = select(".weather-condition-text");

    static pressureIndicator = select(".pressure-indicator");
    static humidityIndicator = select(".humidity-indicator");

    static pressureElement = select(".pressure-number");
    static windElement = select(".wind-number");
    static windFooter = select(".wind-footer");
    static sunriseElement = select(".sunrise-number");
    static sunsetElement = select(".sunset-number");
    static humidityElement = select(".humidity-number");
    static humidityFooter = select(".humidity-footer");
    static visibilityElement = select(".visibility-number");
    static visibilityFooter = select(".visibility-footer");
    static elevationElement = select(".elevation-number");
    static elevationFooter = select(".elevation-footer");

    constructor() {
        this.searchElement = Weather.searchElement;
        this.searchCloseBtn = Weather.searchCloseBtn;
        this.cityElement = Weather.cityElement;
        this.todayIcon = Weather.todayIcon;
        this.temperatureElement = Weather.temperatureElement;
        this.timeDayElement = Weather.timeDayElement;
        this.timeHourElement = Weather.timeHourElement;
        this.conditionIcon = Weather.conditionIcon;
        this.conditionText = Weather.conditionText;

        this.pressureIndicator = Weather.pressureIndicator;
        this.humidityIndicator = Weather.humidityIndicator;

        this.pressureElement = Weather.pressureElement;
        this.windElement = Weather.windElement;
        this.windFooter = Weather.windFooter;
        this.sunriseElement = Weather.sunriseElement;
        this.sunsetElement = Weather.sunsetElement;
        this.humidityElement = Weather.humidityElement;
        this.humidityFooter = Weather.humidityFooter;
        this.visibilityElement = Weather.visibilityElement;
        this.visibilityFooter = Weather.visibilityFooter;
        this.elevationElement = Weather.elevationElement;
        this.elevationFooter = Weather.elevationFooter;

        this.latitude = null;
        this.longitude = null;
        this.currentData = {};
        this.accuCurrentData = {};
        this.data = {};
        this.accuData = {};
        this.apiKey = "";
        this.accuApiKey = "";
    }

    async init() {
        await this.configApiKey();
        await this.requestCoord();
        await this.fetchCurrentData();
        await this.fetchSunriseSunset(this.currentData);
        this.initEvent();
        this.enableSearch();
        this.displayCurrent();
        console.log(this.currentData);
        console.log(this.accuCurrentData);
    }

    initEvent() {
        this.searchElement.addEventListener("keyup", async (event) => {
            const value = event.target.value;
            switch(event.keyCode) {
                case 13: {
                    await this.fetchData(value);
                    await this.fetchSunriseSunset(this.data);
                    this.display();
                    console.log(this.data);
                    console.log(this.accuData);
                    break;
                }
                default: {}
            }
        });
        this.searchCloseBtn.addEventListener("click", () => {
            this.searchElement.value = "";
            this.data = {};
            this.displayCurrent();
        });
    }

    async configApiKey() {
        try {
            const filePath = "../../../env-json/weather.json";
            const accuFilePath = "../../../env-json/accu-weather.json";
            const rawConfig = await fetch(filePath);
            const rawAccuConfig = await fetch(accuFilePath);
            const config = await rawConfig.json();
            const accuConfig = await rawAccuConfig.json();
            this.apiKey = config.apiKey;
            this.accuApiKey = accuConfig.apiKey;
        } catch (err) {
            await this.showError(err.message);
        }
    }

    enableSearch() {
        this.searchElement.removeAttribute("disabled");
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

    async fetchData(value="") {
        if (!value) return;
        try {
            const rawData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${value}&lang=id&appid=${this.apiKey}`);
            const rawAccuData = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?q=${value}&language=id-ID&apikey=${this.accuApiKey}`);
            const data = await rawData.json();
            const accuData = await rawAccuData.json();
            if (data.cod === "404") throw new Error("404");
            this.data = data;
            this.accuData = accuData[0];
            this.latitude = data.coord.lat;
            this.longitude = data.coord.lon;
        } catch (err) {
            this.data = !!Object.keys(this.data).length ? this.data : this.currentData;
            const errMessage = err.message === "404" ? "Kota tidak ditemukan" : "Telah terjadi kesalahan";
            await this.showError(errMessage);
        }
    }

    async fetchCurrentData() {
        if (!(this.latitude && this.longitude)) return;
        try {
            const rawCurrentData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&lang=id&appid=${this.apiKey}`);
            const rawAccuCurrentData = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?q=${this.latitude},${this.longitude}&language=id-ID&apikey=${this.accuApiKey}`);
            const currentData = await rawCurrentData.json();
            const accuCurrentData = await rawAccuCurrentData.json();
            this.currentData = currentData;
            this.accuCurrentData = accuCurrentData;
        } catch (err) {
            await this.showError("Telah terjadi kesalahan pada saat menampilkan cuaca di lokasi anda");
        }
    }
    
    async fetchSunriseSunset(value=this.data) {
        if (!(this.latitude && this.longitude)) return;
        if (!value?.sys) return;
        try {
            const rawData = await fetch(`https://api.sunrise-sunset.org/json?lat=${this.latitude}&lng=${this.longitude}&formatted=0`);
            const data = await rawData.json();
            const sunriseDate = new Date(data.results.sunrise);
            const sunsetDate = new Date(data.results.sunset);
            const localTimezone = -(new Date().getTimezoneOffset() * 60);
            sunriseDate.setUTCSeconds(sunriseDate.getUTCSeconds() + value.timezone - localTimezone);
            sunsetDate.setUTCSeconds(sunsetDate.getUTCSeconds() + value.timezone - localTimezone);
            value.sys.sunrise = sunriseDate.getTime();
            value.sys.sunset = sunsetDate.getTime();
        } catch (err) {
            const errMessage = "Telah terjadi kesalahan pada saat menampilkan waktu terbit dan terbenam";
            await this.showError(errMessage);
        }
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
        const icon = value?.weather && value.weather[0]?.icon;
        if (!icon) return;
        const url = `../../../images/weather/icon/${icon}.png`;
        this.todayIcon.setAttribute("src", url);
        this.conditionIcon.setAttribute("src", url);
    }

    displayTodayTime(value=this.data) {
        const timezone = value?.timezone || 0;
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const leadZero = (number) => number < 10 ? "0" + String(number) : String(number);
        const date = new Date();
        date.setUTCSeconds(date.getUTCSeconds() + timezone);
        const day = `${days[date.getUTCDay()]}, `;
        const clock = `${leadZero(date.getUTCHours())}:${leadZero(date.getUTCMinutes())}`;
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
        const condition = value?.weather && value.weather[0]?.description
        if (!condition) {
            this.conditionIcon.src = "../../../images/weather/weather-haze.svg";
            this.conditionText.innerHTML = "N/A";
            return;
        }
        const toCapitalize = (string) => string.split(" ").map(s => s[0].toUpperCase() + s.substr(1, s.length - 1)).join(" ");
        this.conditionText.innerHTML = toCapitalize(condition);
    }

    displayPressure(value=this.data) {
        const pressure = value?.main?.pressure;
        if (!pressure) return this.pressureElement.innerHTML = "N/A";
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
        const degreeNumber = degree % 360;
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        const degreeRanges = [[0, 0], [1, 44], [45, 45], [46, 89], [90, 90], [91, 134], [135, 135], [136, 179], [180, 180], [181, 224], [225, 225], [226, 269], [270, 270], [271, 314], [315, 315], [316, 359]];
        const filteredDegreeRanges = degreeRanges.filter((range) => {
               return degreeNumber >= range[0] || degreeNumber >= range[1]; 
        });
        const directionIndex = filteredDegreeRanges.length - 1;
        const currentDirection = directions[directionIndex];
        this.windFooter.innerHTML = currentDirection;
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
        const humidity = value?.main?.humidity;
        if (!humidity) return "N/A";
        const levels = ["Sangat Aman", "Aman", "Berbahaya", "Sangat Berbahaya"];
        const minNumbers = [0, 40, 60, 80];
        const filteredMinNumbers = minNumbers.filter((n) => humidity >= n);
        const levelIndex = filteredMinNumbers.length - 1;
        const currentLevel = levels[levelIndex];
        this.humidityFooter.innerHTML = currentLevel || "N/A";
    }

    displayHumidityIndicator(value=this.data) {
        const humidity = value?.main?.humidity;
        const height = humidity ?? 0;
        this.humidityIndicator.style.height = `calc((${height} / 100) * 98px + 22px)`;
    }

    displayVisibility(value=this.data) {
        const visibility = value?.visibility;
        if (!visibility) return this.visibilityElement.innerHTML = "N/A";
        const visibilityKm = Math.round(visibility / 1000 * 10) / 10;
        this.visibilityElement.innerHTML = visibilityKm;
    }
    
    displayVisibilityFooter(value=this.data) {
        const visibility = value?.visibility;
        if (!visibility) return "N/A";
        const levels = ["Sangat Buruk", "Buruk", "Sedang", "Baik"];
        const minNumbers = [0, 1000, 3705, 9261];
        const filteredMinNumbers = minNumbers.filter((n) => visibility >= n);
        const levelIndex = filteredMinNumbers.length - 1;
        const currentLevel = levels[levelIndex];
        this.visibilityFooter.innerHTML = currentLevel || "N/A";
    }

    displayElevation(value=this.accuData) {
        const elevation = value?.GeoPosition?.Elevation?.Metric?.Value;
        if (!elevation) return;
        this.elevationElement.innerHTML = elevation;
    }
        
    displayElevationFooter(value=this.accuData) {
        const elevation = value?.GeoPosition?.Elevation?.Metric?.Value;
        if (!elevation) return "N/A";
        const elevationFoot = Math.round(elevation * 3.28084);
        const elevationFootString = `${elevationFoot} kaki`;
        this.elevationFooter.innerHTML = elevationFootString;
    }

    displayAll(value=this.data, accuValue=this.accuData) {
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
        this.displayElevation(accuValue);
        this.displayElevationFooter(accuValue);
    }

    displayCurrent() {
        this.displayAll(this.currentData, this.accuCurrentData);
    }

    display() {
        this.displayAll(this.data, this.accuData);
    }
}
class WeatherServer {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async loadMeteo(city, units, language) {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${language}&APPID=${this.apiKey}`;
        return await $.getJSON(url);
    }
}

class Controller {
    constructor(weatherServer, places, units, language) {
        this.places = places;
        this.units = units;
        this.language = language;
        this.weatherServer = weatherServer;
    }
    async loadSectionsFromServer() {
        return await Promise.all(places.map(place => this.weatherServer.loadMeteo(place, this.units, this.language)
            .then(placeMeteo => {
                const section = this.section(placeMeteo.name);
                section.append(this.iconImage(placeMeteo.weather[0].icon),
                    this.weatherParagraph(placeMeteo.weather[0].description),
                    this.coordsParagraph(placeMeteo.coord.lon, placeMeteo.coord.lat),
                    this.preassureHumidityParagraph(placeMeteo.main.pressure, placeMeteo.main.humidity),
                    this.temperatureParagraph(placeMeteo.main.temp, placeMeteo.main.feels_like, placeMeteo.main.temp_min, placeMeteo.main.temp_max),
                    this.windParagraph(placeMeteo.wind.deg, placeMeteo.wind.speed),
                    this.visibilityCloudsParagraph(placeMeteo.visibility, placeMeteo.clouds.all),
                    this.sunriseSunsetParagraph(placeMeteo.sys.sunrise, placeMeteo.sys.sunset));
                return section;
            })));
    }
    loadSectionsInView() {
        this.loadSectionsFromServer().then(sections => sections.forEach(section => document.body.append(section)));
    }
    section(place) {
        const section = document.createElement('section');
        const header = document.createElement('header');
        const title = document.createElement('h2');
        title.append(place);
        header.append(title);
        section.append(header);
        return section;
    }
    coordsParagraph(lon, lat) {
        const p = document.createElement('p');
        p.append(`Las coordenadas son longitud ${lon} y latitud ${lat}`);
        return p;
    }
    weatherParagraph(weatherDescription) {
        const p = document.createElement('p');
        p.append(`El tiempo es ${weatherDescription}`);
        return p;
    }
    temperatureParagraph(temp, feels_like, temp_min, temp_max) {
        const p = document.createElement('p');
        p.append(`Temperatura de ${temp}C con máximo de ${temp_max} y un mínimo de ${temp_min}. La sensación térmica es de unos ${feels_like}C`);
        return p;
    }
    preassureHumidityParagraph(pressure, humidity) {
        const p = document.createElement('p');
        p.append(`La presión es de ${pressure} milibares y tenemos una humedad al ${humidity}%`);
        return p;
    }
    sunriseSunsetParagraph(sunrise, sunset) {
        const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString('es-ES');
        const sunsetTime = new Date(sunset * 1000).toLocaleTimeString('es-ES');
        const p = document.createElement('p');
        p.append(`El amanecer es a las ${sunriseTime} y el anochecer a las ${sunsetTime}`);
        return p;
    }
    windParagraph(direction, speed) {
        const p = document.createElement('p');
        p.append(`La dirección del viento es ${direction} grados y su velocidad es ${speed} m/s`);
        return p;
    }
    visibilityCloudsParagraph(visibility, clouds) {
        const p = document.createElement('p');
        p.append(`La visibilidad es de ${visibility} metros y la nubosidad del ${clouds}%`);
        return p;
    }
    iconImage(iconId) {
        const img = document.createElement('img');
        const src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
        img.setAttribute('src', src);
        img.setAttribute('alt', 'Icono del tiempo');
        return img;
    }
}
const apikey = 'ca1dc447b97a035b69872b47ed314659';
const units = 'metric';
const language = 'es';
const places = ['Minas de Riotinto', 'Cofrentes', 'Burgos', 'Huelva', 'Valencia'];
const controller = new Controller(new WeatherServer(apikey), places, units, language);
controller.loadSectionsInView();
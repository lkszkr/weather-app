import * as api from './api.js';
import { resolveWeatherCode } from './utils.js';

class View {

    #locationDataDefault = {
        lat: 52.22977,
        lng: 21.01178,
        country: 'Poland',
        name: 'Warsaw',
    };
    #currentLocationData = this.#locationDataDefault;
    #currentWehaterData = null;

    constructor() {
        (async () => await this.#updateContent(this.#locationDataDefault))();
        document.querySelector('.nav-btn').classList.add('btn-active');
        this.#setupButtons();
        this.#handleInput();
    }

    #handleInput() {
        const ul = document.querySelector('.suggestions');
        const input = document.querySelector('#search');
        let timer;

        this.#setupValidation();

        input.addEventListener('input', (e) => {
            const value = e.target.value;
            clearTimeout(timer);
            if (input.checkValidity()) {
                timer = setTimeout(async () => {
                    const data = await api.fetchGeocoding(value);
                    ul.classList.add('active');
                    this.#updateSuggestions(data);
                }, 500);
            } else {
                ul.classList.remove('active');
            }
        });

        input.addEventListener('blur', (e) => {
            ul.classList.remove('active');
        });

        input.addEventListener('focus', () => {
            if (input.checkValidity()) {
                ul.classList.add('active');
            }
        });
    }

    async #updateContent(locData) {
        const data = await api.fetchWeather(locData.lat, locData.lng);
        this.#currentWehaterData = data;
        this.#updateHeader(locData.name, locData.country);
        this.#updateMain(data.current, 'current');
        this.#updateAside(data.hourly.slice(0, 24));
    }

    #updateHeader(city, country) {
        const location = document.querySelector('.location');
        location.textContent = `${city}, ${country}`;
    }

    async #updateMain(data, dataTitle) {
        const weatherCodeData = resolveWeatherCode(data.weatherCode, data.isNight);
        this.#updateSvg('.weather-icon', weatherCodeData.svg);
        this.#updateSpan('.weather-desc', weatherCodeData.desc);

        this.#updateSpan('.title', dataTitle);

        if (dataTitle === 'days') {
            this.#updateSpan('.current-time', data.time.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' }));
        } else {
            this.#updateSpan('.current-time', data.time.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }));
        }

        this.#updateSpan('.temperature', data.temperature);
        this.#updateSpan('.precipitationProbability', data.precipitationProbability);
        this.#updateSpan('.precipitation', data.precipitation);
        this.#updateSpan('.windSpeed', data.windSpeed);
        this.#updateSpan('.uvIndex', data.uvIndex);
        this.#updateSpan('.surfacePressure', data.surfacePressure);
        this.#updateSpan('.relativeHumidity', data.relativeHumidity);
        this.#updateSpan('.europeanAqi', data.europeanAqi);
        this.#updateSpan('.sunrise', data.sunrise.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }));
        this.#updateSpan('.sunset', data.sunset.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }));
    }

    #updateAside(data, dataTitle) {
        const ul = document.querySelector('.forecast-list');
        ul.textContent = '';

        data.forEach((element) => {
            const template = document.querySelector('template');
            const tempContent = template.content.cloneNode(true);
            const forecastTile = tempContent.querySelector('.forecast-tile');

            const weatherCodeData = resolveWeatherCode(element.weatherCode, element.isNight);
            this.#updateSvg('.forecast-icon', weatherCodeData.svg, forecastTile);
            this.#updateSpan('.forecast-desc', weatherCodeData.desc, forecastTile);

            if (dataTitle === 'days') {
                this.#updateSpan('.forecast-time', element.time.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' }), forecastTile);
            } else {
                this.#updateSpan('.forecast-time', element.time.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }), forecastTile);
            }

            this.#updateSpan('.forecast-temperature', element.temperature, forecastTile);
            this.#updateSpan('.forecast-windSpeed', element.windSpeed, forecastTile);
            this.#updateSpan('.forecast-precipitation', element.precipitation, forecastTile);

            forecastTile.addEventListener('click', () => {
                if (!dataTitle) dataTitle = 'today';
                this.#updateMain(element, dataTitle);
            });

            ul.appendChild(forecastTile);
        });
    }

    #setupButtons() {
        const btns = document.querySelectorAll('.nav-btn');
        btns.forEach((btn) => {
            btn.addEventListener('click', () => {
                btns.forEach((b) => b.classList.remove('btn-active'))
                btn.classList.add('btn-active');
                let data;
                switch (btn.value) {
                    case 'today':
                        data = this.#currentWehaterData.hourly.slice(0, 24);
                        break;
                    case 'tomorrow':
                        data = this.#currentWehaterData.hourly.slice(24);
                        break;
                    case 'days':
                        data = this.#currentWehaterData.daily;
                        break;
                }
                this.#updateAside(data, btn.value);
            });
        });
        const currentBtn = document.querySelector('.current-btn');
        currentBtn.addEventListener('click', () => {
            this.#updateContent(this.#currentLocationData);
            btns.forEach((b) => b.classList.remove('btn-active'))
            document.querySelector('.nav-btn').classList.add('btn-active');
        });
    }

    #setupValidation() {
        const form = document.querySelector('.search-form');
        const input = document.querySelector('#search');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        input.addEventListener('invalid', () => {
            input.setCustomValidity('');
            if (input.validity.valueMissing) {
                input.setCustomValidity('Please fill out this field.');
            } else if (input.validity.tooShort) {
                input.setCustomValidity('Enter at least 3 characters.');
            }
        });

        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    }

    #updateSuggestions(data) {
        const ul = document.querySelector('.suggestions');
        const input = document.querySelector('#search');
        ul.textContent = '';
        data.forEach(element => {
            const li = document.createElement('li');
            li.textContent = `${element.name}, ${element.country}, ${element.admin1}, ${element.admin2}, ${element.admin3}`;
            li.setAttribute('data-lat', element.lat);
            li.setAttribute('data-lng', element.lng);
            li.setAttribute('data-name', element.name);
            li.setAttribute('data-country', element.country);
            li.addEventListener('mousedown', (e) => {
                this.#currentLocationData = element;
                this.#updateContent(element);
                ul.textContent = '';
                input.value = '';
                ul.classList.remove('active');
            });
            ul.appendChild(li);
        });
    }

    #updateSpan(selector, value, container = document,) {
        const span = container.querySelector(selector);
        if (span) span.textContent = value + " ";
    }

    #updateSvg(selector, value, container = document) {
        const svg = container.querySelector(selector);
        if (svg) svg.innerHTML = `<img src="${value}" alt="weather">`;
    }
}

export default View;
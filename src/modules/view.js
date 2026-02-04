import * as api from './api.js';
import { resolveWeatherCode } from './utils.js';

class View {

    handleInput() {
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

    async updateContent(locationData) {
        const data = await api.fetchWeather(locationData.lat, locationData.lng);
        this.#updateHeader(locationData.name, locationData.country);
        this.#updateMain(data.current, 'Current');
        // this.#updateAside(data.hourly, data.daily);
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
        this.#updateSpan('.current-time', data.time.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }));
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

    #updateAside() {

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
                this.updateContent(element);
                ul.textContent = '';
                input.value = '';
                ul.classList.remove('active');
            });
            ul.appendChild(li);
        });
    }

    #updateSpan(selector, value) {
        const span = document.querySelector(selector);
        if (span) span.textContent = value + " ";
    }

    #updateSvg(selector, value) {
        const svg = document.querySelector(selector);
        if (svg) svg.innerHTML = `<img src="${value}" alt="weather">`;
    }
}


export default View;
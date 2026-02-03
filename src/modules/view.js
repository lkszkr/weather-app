import * as api from './api.js';

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

    updateContent(locationData){
        
        api.fetchWeather();
        this.#updateMain();
        this.#updateAside();
    }

    #updateMain(){

    }

    #updateAside(){

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
        ul.textContent = '';
        data.forEach(element => {
            const li = document.createElement('li');
            li.textContent = `${element.name}, ${element.country}, ${element.admin1}, ${element.admin2}, ${element.admin3}`;
            li.setAttribute('data-lat', element.lat);
            li.setAttribute('data-lng', element.lng);
            li.setAttribute('data-name', element.name);
            li.setAttribute('data-country', element.country);
            li.addEventListener('click', (e) => {
                this.updateContent();
                ul.textContent = '';
                ul.classList.remove('active');
            });
            ul.appendChild(li);
        });
    }
}


export default View;
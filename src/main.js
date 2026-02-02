import './styles/styles.css';
import * as API from './modules/api.js'

const data = API.fetchGeocoding('berlin').then((results) => {
    console.log(results);
    API.fetchWeather(results[0].lat, results[0].lng);
} )

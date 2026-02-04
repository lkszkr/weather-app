import { getMappedName } from "./utils";

const FORECAST_HOURS = 48;
const HOURS_IN_DAY = 24;

export async function fetchGeocoding(name = 'warsaw') {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=en&format=json`;
    let rawData;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        rawData = await res.json();
        if (!rawData.results) throw new Error('No results');
    } catch (err) {
        console.log(err);
        return [];
    }

    const data = rawData.results.map(obj => {
        return {
            lat: obj.latitude,
            lng: obj.longitude,
            name: obj.name,
            country: obj.country,
            admin1: obj.admin1,
            admin2: obj.admin2,
            admin3: obj.admin3,
        };
    });

    return data;
}

export async function fetchWeather(lat = 52.22977, lng = 21.01178) {
    const paramsWeatherHourly = [
        'temperature_2m',
        'precipitation_probability',
        'precipitation',
        'wind_speed_10m',
        'uv_index',
        'surface_pressure',
        'relative_humidity_2m',
        'weather_code'
    ];

    const paramsWeatherDaily = [
        'temperature_2m_mean',
        'precipitation_probability_mean',
        'precipitation_sum',
        'wind_speed_10m_mean',
        'uv_index_max',
        'surface_pressure_mean',
        'relative_humidity_2m_mean',
        'weather_code',
        'sunrise',
        'sunset'
    ];

    const paramsWeather = {
        latitude: lat,
        longitude: lng,
        current: [...paramsWeatherHourly].join(),
        hourly: [...paramsWeatherHourly].join(),
        daily: [...paramsWeatherDaily].join(),
        timezone: 'auto',
        forecast_days: 7
    };

    const paramsAirQuality = {
        latitude: lat,
        longitude: lng,
        current: [
            'european_aqi',
        ].join(),
        hourly: [
            'european_aqi',
        ].join(),
        timezone: 'auto',
        forecast_days: 7
    };

    let queryString = new URLSearchParams(paramsWeather).toString();
    const url = 'https://api.open-meteo.com/v1/forecast?' + queryString;

    queryString = new URLSearchParams(paramsAirQuality).toString();
    const urlAir = 'https://air-quality-api.open-meteo.com/v1/air-quality?' + queryString;

    let weather, air;

    try {
        const [resWeather, resAir] = await Promise.all([
            fetch(url),
            fetch(urlAir)
        ]);
        if (!resWeather.ok || !resAir.ok) throw new Error(resWeather.status + '\n' + resAir.status);

        [weather, air] = await Promise.all([
            resWeather.json(),
            resAir.json()
        ]);

    } catch (err) {
        console.log(err);
        return [];
    }

    return processWeatherData(weather, air, paramsWeatherHourly, paramsWeatherDaily);
}

function processWeatherData(weather, air, paramsH, paramsD) {
    // 7 day forecast, always start from 00:00 current day
    const daily = handeDailyData(weather, air, paramsD);
    // Current weather
    const current = handleCurrentData(weather, air, paramsH, daily);
    // 2 day forecast, always start from 00:00 current day
    const hourly = handleHourlyData(weather, air, paramsH, daily);

    const data = {
        current: current,
        hourly: hourly,
        daily: daily,
    };
    return data;
}

function handeDailyData(weather, air, params) {
    const aqiDailyMax = dailyMaxAirQuality(air);
    return weather.daily.time.map((t, index) => {
        const row = {
            time: new Date(t),
            europeanAqi: aqiDailyMax[index] ?? 'N/A',
            isNight: false,
        };
        params.forEach(param => {
            const newKey = getMappedName(param);
            if (param === 'sunrise' || param === 'sunset') {
                row[newKey] = new Date(
                    weather.daily[param][index]
                );
                return;
            }
            row[newKey] = weather.daily[param][index];
        });
        return row;
    });
}

function handleCurrentData(weather, air, params, daily) {
    const dateObj = new Date(weather.current.time);
    const today = daily[0];
    weather.current.europeanAqi = air.current.european_aqi;
    weather.current.time = dateObj;
    weather.current.isNight = dateObj < today.sunrise || dateObj > today.sunset;
    weather.current.sunrise = today.sunrise;
    weather.current.sunset = today.sunset;
    delete weather.current.interval;
    params.forEach(param => {
        const newKey = getMappedName(param);
        weather.current[newKey] = weather.current[param];
        if(newKey !== param) delete weather.current[param];
    });
    return weather.current;
}

function handleHourlyData(weather, air, params, daily) {
    return weather.hourly.time.slice(0, FORECAST_HOURS).map((t, index) => {
        const dateObj = new Date(t);
        const dayIndex = Math.floor(index / HOURS_IN_DAY);
        const today = daily[dayIndex];
        const row = {
            time: dateObj,
            europeanAqi: air.hourly.european_aqi[index],
            isNight: dateObj < today.sunrise || dateObj > today.sunset,
            sunrise: today.sunrise,
            sunset: today.sunset,
        };
        params.forEach(param => {
            const newKey = getMappedName(param);
            row[newKey] = weather.hourly[param][index];
        });
        return row;
    });
}

function dailyMaxAirQuality(air) {
    const airQualityDailyMax = [];
    for (let i = 0; i < air.hourly.european_aqi.length; i += HOURS_IN_DAY) {
        const dailyData = air.hourly.european_aqi.slice(i, i + HOURS_IN_DAY);

        const maxAqi = dailyData.reduce((max, current) => {
            return current > max ? current : max;
        }, dailyData[0]);

        airQualityDailyMax.push(maxAqi);
    }
    return airQualityDailyMax;
}
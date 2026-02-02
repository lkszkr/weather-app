export async function fetchGeocoding(name = 'warsaw') {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=en&format=json`;
    let rawData;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.status);
        rawData = await res.json();
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
            'european_aqi'
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
    const FORECAST_HOURS = 48;
    weather.current.european_aqi = air.current.european_aqi;

    // Current weather
    const dateObj = new Date(weather.current.time);
    weather.current.time = dateObj.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
    delete weather.current.interval;

    // 2 day forecast, always start from 00:00 current day
    const hourly = weather.hourly.time.slice(0, FORECAST_HOURS).map((t, index) => {
        const dateObj = new Date(t);

        const row = {
            time: dateObj.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' }),
            date: dateObj.toLocaleDateString('en-GB'),
            airQuality: air.hourly.european_aqi[index]
        };

        paramsH.forEach(param => {
            row[param] = weather.hourly[param][index];
        });

        return row;
    });

    // 7 day forecast, always start from 00:00 current day
    weather.daily.air_quality_max = dailyMaxAirQuality(air);
    const daily = weather.daily.time.map((t, index) => {
        const row = {
            date: new Date(t).toLocaleDateString('en-GB', { weekday: 'long' }),
            airQualityMax: weather.daily.air_quality_max[index].airQualityMax,
        };

        paramsD.forEach(param => {
            if (param === 'sunrise' || param === 'sunset') {
                row[param] = new Date(
                    weather.daily[param][index]
                ).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
                return;
            }
            row[param] = weather.daily[param][index];
        });

        return row;
    });

    const data = {
        current: weather.current,
        hourly: hourly,
        daily: daily,
    };

    console.log(data)
    return data;
}

function dailyMaxAirQuality(air) {
    const airQualityDailyMax = [];
    for (let i = 0; i < air.hourly.european_aqi.length; i += 24) {
        const dailyData = air.hourly.european_aqi.slice(i, i + 24);

        const maxAqi = dailyData.reduce((max, current) => {
            return current > max ? current : max;
        }, dailyData[0]);

        airQualityDailyMax.push({
            time: air.hourly.time[i],
            airQualityMax: maxAqi,
        });
    }
    return airQualityDailyMax;
}
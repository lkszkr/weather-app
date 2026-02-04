import WEATHER_CODES from './weather_codes';

export function getMappedName(param) {
    const NAME_MAP = {
        'temperature_2m': 'temperature',
        'temperature_2m_mean': 'temperature',
        'precipitation_probability': 'precipitationProbability',
        'precipitation_probability_mean': 'precipitationProbability',
        'precipitation_sum': 'precipitation',
        'wind_speed_10m': 'windSpeed',
        'wind_speed_10m_mean': 'windSpeed',
        'uv_index': 'uvIndex',
        'uv_index_max': 'uvIndex',
        'surface_pressure': 'surfacePressure',
        'surface_pressure_mean': 'surfacePressure',
        'relative_humidity_2m': 'relativeHumidity',
        'relative_humidity_2m_mean': 'relativeHumidity',
        'weather_code': 'weatherCode',
    };
    return NAME_MAP[param] || param;
}

export function resolveWeatherCode(weatherCode, isNight) {
    const keys = Object.keys(WEATHER_CODES);
    const key = keys.find((key) => key === String(weatherCode));
    return {
        desc: WEATHER_CODES[key].desc,
        svg: isNight ? WEATHER_CODES[key].iconNight : WEATHER_CODES[key].iconDay
    };
}

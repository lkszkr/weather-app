import clearDay from '../assets/weather_icons/clear-day.svg';
import clearNight from '../assets/weather_icons/clear-night.svg';
import partlyCloudyDay from '../assets/weather_icons/partly-cloudy-day.svg';
import partlyCloudyNight from '../assets/weather_icons/partly-cloudy-night.svg';
import overcastDay from '../assets/weather_icons/overcast-day.svg';
import overcastNight from '../assets/weather_icons/overcast-night.svg';
import partlyCloudyDayFog from '../assets/weather_icons/partly-cloudy-day-fog.svg';
import partlyCloudyNightFog from '../assets/weather_icons/partly-cloudy-night-fog.svg';
import fogDay from '../assets/weather_icons/fog-day.svg';
import fogNight from '../assets/weather_icons/fog-night.svg';
import partlyCloudyDayDrizzle from '../assets/weather_icons/partly-cloudy-day-drizzle.svg';
import partlyCloudyNightDrizzle from '../assets/weather_icons/partly-cloudy-night-drizzle.svg';
import drizzle from '../assets/weather_icons/drizzle.svg';
import partlyCloudyDaySleet from '../assets/weather_icons/partly-cloudy-day-sleet.svg';
import partlyCloudyNightSleet from '../assets/weather_icons/partly-cloudy-night-sleet.svg';
import partlyCloudyDayRain from '../assets/weather_icons/partly-cloudy-day-rain.svg';
import partlyCloudyNightRain from '../assets/weather_icons/partly-cloudy-night-rain.svg';
import rain from '../assets/weather_icons/rain.svg';
import sleet from '../assets/weather_icons/sleet.svg';
import partlyCloudyDaySnow from '../assets/weather_icons/partly-cloudy-day-snow.svg';
import partlyCloudyNightSnow from '../assets/weather_icons/partly-cloudy-night-snow.svg';
import snow from '../assets/weather_icons/snow.svg';
import thunderstormsDayRain from '../assets/weather_icons/thunderstorms-day-rain.svg';
import thunderstormsNightRain from '../assets/weather_icons/thunderstorms-day-rain.svg';

export default {
    '0': {
        'desc': 'Clear sky',
        'iconDay': clearDay,
        'iconNight': clearNight
    },
    '1': {
        'desc': 'Mainly clear',
        'iconDay': clearDay,
        'iconNight': clearNight
        
    },
    '2': {
        'desc': 'Partly cloudy',
        'iconDay': partlyCloudyDay,
        'iconNight': partlyCloudyNight
        
    },
    '3': {
        'desc': 'Overcast',
        'iconDay': overcastDay,
        'iconNight': overcastNight
        
    },
    '45': {
        'desc': 'Fog',
        'iconDay': partlyCloudyDayFog,
        'iconNight': partlyCloudyNightFog
        
    },
    '48': {
        'desc': 'Depositing rime fog',
        'iconDay': fogDay,
        'iconNight': fogNight
        
    },
    '51': {
        'desc': 'Drizzle: Light intensity',
        'iconDay': partlyCloudyDayDrizzle,
        'iconNight': partlyCloudyNightDrizzle
        
    },
    '53': {
        'desc': 'Drizzle: Moderate intensity',
        'iconDay': partlyCloudyDayDrizzle,
        'iconNight': partlyCloudyNightDrizzle
        
    },
    '55': {
        'desc': 'Drizzle: Dense intensity',
        'iconDay': drizzle,
        'iconNight': drizzle
        
    },
    '56': {
        'desc': 'Freezing Drizzle: Light intensity',
        'iconDay': partlyCloudyDaySleet,
        'iconNight': partlyCloudyNightSleet
        
    },
    '57': {
        'desc': 'Freezing Drizzle: Dense intensity',
        'iconDay': partlyCloudyDaySleet,
        'iconNight': partlyCloudyNightSleet
        
    },
    '61': {
        'desc': 'Rain: Slight intensity',
        'iconDay': partlyCloudyDayRain,
        'iconNight': partlyCloudyNightRain
        
    },
    '63': {
        'desc': 'Rain: Moderate intensity',
        'iconDay': partlyCloudyDayRain,
        'iconNight': partlyCloudyNightRain
        
    },
    '65': {
        'desc': 'Rain: Heavy intensity',
        'iconDay': rain,
        'iconNight': rain
        
    },
    '66': {
        'desc': 'Freezing Rain: Light intensity',
        'iconDay': partlyCloudyDaySleet,
        'iconNight': partlyCloudyNightSleet
        
    },
    '67': {
        'desc': 'Freezing Rain: Heavy intensity',
        'iconDay': sleet,
        'iconNight': sleet
        
    },
    '71': {
        'desc': 'Snow fall: Slight intensity',
        'iconDay': partlyCloudyDaySnow,
        'iconNight': partlyCloudyNightSnow
        
    },
    '73': {
        'desc': 'Snow fall: Moderate intensity',
        'iconDay': partlyCloudyDaySnow,
        'iconNight': partlyCloudyNightSnow
        
    },
    '75': {
        'desc': 'Snow fall: Heavy intensity',
        'iconDay': snow,
        'iconNight': snow
        
    },
    '77': {
        'desc': 'Snow grains',
        'iconDay': snow,
        'iconNight': snow
        
    },
    '80': {
        'desc': 'Rain showers: Slight',
        'iconDay': rain,
        'iconNight': rain
        
    },
    '81': {
        'desc': 'Rain showers: Moderate',
        'iconDay': rain,
        'iconNight': rain
        
    },
    '82': {
        'desc': 'Rain showers: Violent',
        'iconDay': rain,
        'iconNight': rain
        
    },
    '85': {
        'desc': 'Snow showers: Slight',
        'iconDay': snow,
        'iconNight': snow
        
    },
    '86': {
        'desc': 'Snow showers: Heavy',
        'iconDay': snow,
        'iconNight': snow
        
    },
    '95': {
        'desc': 'Thunderstorm: Slight or moderate',
        'iconDay': thunderstormsDayRain,
        'iconNight': thunderstormsNightRain
        
    },
    '96': {
        'desc': 'Thunderstorm: Slight hail',
        'iconDay': thunderstormsDayRain,
        'iconNight': thunderstormsNightRain
        
    },
    '99': {
        'desc': 'Thunderstorm: Heavy hail',
        'iconDay': thunderstormsDayRain,
        'iconNight': thunderstormsNightRain
        
    }
}
import axios from 'axios';

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city: string;
}

export interface ForecastDay {
  date: string;
  temp_day: number;
  temp_night: number;
  description: string;
  icon: string;
  humidity: number;
}

export const weatherService = {
  getCurrentWeather: async (city: string): Promise<WeatherData> => {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    if (!city || city.trim() === '') {
      throw new Error('City name is required');
    }

    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: city.trim(),
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      });

      const data = response.data;
      return {
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        wind_speed: data.wind.speed,
        city: data.name,
      };
    } catch (error: any) {
      console.error('Weather fetch error:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error(`City "${city}" not found`);
        } else if (error.response.status === 401) {
          throw new Error('Invalid API key');
        } else if (error.response.status === 429) {
          throw new Error('Too many requests. Please try again later');
        }
      }
      
      throw new Error('Failed to fetch weather data. Please check your internet connection');
    }
  },

  getForecast: async (city: string, days: number = 5): Promise<ForecastDay[]> => {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    if (!city || city.trim() === '') {
      throw new Error('City name is required');
    }

    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          q: city.trim(),
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      });

      // Group by day
      const dailyData: { [key: string]: any[] } = {};
      
      response.data.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      const forecast: ForecastDay[] = Object.keys(dailyData)
        .slice(0, days)
        .map(date => {
          const dayData = dailyData[date];
          
          // Get temps from different times of day
          const allTemps = dayData.map((d: any) => d.main.temp);
          const maxTemp = Math.max(...allTemps);
          const minTemp = Math.min(...allTemps);
          
          // Find midday data for more accurate representation
          const middayData = dayData.find((d: any) => 
            d.dt_txt.includes('12:00:00') || d.dt_txt.includes('15:00:00')
          ) || dayData[Math.floor(dayData.length / 2)];

          return {
            date,
            temp_day: Math.round(maxTemp),
            temp_night: Math.round(minTemp),
            description: middayData.weather[0].description,
            icon: middayData.weather[0].icon,
            humidity: middayData.main.humidity,
          };
        });

      return forecast;
    } catch (error: any) {
      console.error('Forecast fetch error:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          throw new Error(`City "${city}" not found`);
        } else if (error.response.status === 401) {
          throw new Error('Invalid API key');
        } else if (error.response.status === 429) {
          throw new Error('Too many requests. Please try again later');
        }
      }
      
      throw new Error('Failed to fetch forecast data. Please check your internet connection');
    }
  },

  getWeatherIcon: (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
};
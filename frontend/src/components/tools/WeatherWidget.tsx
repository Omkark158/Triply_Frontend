import { useApi } from '../hooks/useApi';
import { weatherService, WeatherData, ForecastDay } from '../services/weather';

interface WeatherWidgetProps {
  city: string;
  showForecast?: boolean;
  forecastDays?: number;
}

const WeatherWidget = ({ city, showForecast = false, forecastDays = 5 }: WeatherWidgetProps) => {
  const { data: weather, loading, error, refetch } = useApi<WeatherData>(
    () => weatherService.getCurrentWeather(city),
    [city]
  );

  const { data: forecast } = useApi<ForecastDay[]>(
    () => weatherService.getForecast(city, forecastDays),
    [city, forecastDays]
  );

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading weather...</span>
      </div>
    );
  }

  // ❌ Error State (your new addition)
  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-xl shadow-md">
        <p className="font-semibold">Error: {error.message}</p>
        <button
          onClick={refetch}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ⛔ No data
  if (!weather) return null;

  // ✅ Main Weather Widget
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 w-80 text-center">
      {/* Current Weather */}
      <h2 className="text-xl font-semibold mb-2">{weather.city}</h2>
      <img
        src={weatherService.getWeatherIcon(weather.icon)}
        alt={weather.description}
        className="w-16 h-16 mx-auto"
      />
      <p className="text-3xl font-bold">{weather.temp}°C</p>
      <p className="capitalize text-gray-600">{weather.description}</p>

      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>💧 {weather.humidity}%</span>
        <span>🌬 {weather.wind_speed} m/s</span>
      </div>

      {/* Refresh Button */}
      <button
        onClick={refetch}
        className="mt-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
      >
        Refresh
      </button>

      {/* Optional Forecast */}
      {showForecast && forecast && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Forecast ({forecastDays} days)</h3>
          <div className="grid grid-cols-2 gap-2">
            {forecast.map((day) => (
              <div key={day.date} className="border p-2 rounded-lg text-sm">
                <p className="font-medium">{day.date}</p>
                <img
                  src={weatherService.getWeatherIcon(day.icon)}
                  alt={day.description}
                  className="w-10 h-10 mx-auto"
                />
                <p className="capitalize">{day.description}</p>
                <p>🌞 {day.temp_day}°C</p>
                <p>🌙 {day.temp_night}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;

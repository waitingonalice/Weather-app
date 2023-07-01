const base = "https://api.openweathermap.org/";
const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export const apiRoute = {
  currentWeather: (lat: number, long: number) =>
    `${base}data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`,
  geocoding: (city: string, country: string) =>
    `${base}geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(
      country
    )}&limit=1&appid=${apiKey}`,
};

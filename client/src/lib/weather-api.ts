import { apiRequest } from "./queryClient";

export interface WeatherLocation {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
}

export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  const response = await apiRequest("GET", `/api/weather/search?q=${encodeURIComponent(query)}`);
  return await response.json();
}

export async function getCurrentWeather(lat: number, lon: number) {
  const response = await apiRequest("GET", `/api/weather/current?lat=${lat}&lon=${lon}`);
  return await response.json();
}

export async function getWeatherForecast(lat: number, lon: number) {
  const response = await apiRequest("GET", `/api/weather/forecast?lat=${lat}&lon=${lon}`);
  return await response.json();
}

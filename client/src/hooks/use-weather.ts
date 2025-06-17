import { useQuery } from "@tanstack/react-query";
import type { CurrentWeather, WeatherForecast } from "@shared/schema";

export function useWeather(lat?: number, lon?: number) {
  const currentWeatherQuery = useQuery({
    queryKey: ["/api/weather/current", lat, lon],
    queryFn: async () => {
      const response = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch current weather');
      }
      return response.json();
    },
    enabled: !!lat && !!lon,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const forecastQuery = useQuery({
    queryKey: ["/api/weather/forecast", lat, lon],
    queryFn: async () => {
      const response = await fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather forecast');
      }
      return response.json();
    },
    enabled: !!lat && !!lon,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  return {
    currentWeather: currentWeatherQuery.data as CurrentWeather,
    forecast: forecastQuery.data as { hourly: any[]; daily: any[] },
    isLoading: currentWeatherQuery.isLoading || forecastQuery.isLoading,
    error: currentWeatherQuery.error || forecastQuery.error,
    refetch: () => {
      currentWeatherQuery.refetch();
      forecastQuery.refetch();
    },
  };
}

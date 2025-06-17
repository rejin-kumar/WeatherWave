import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "";

if (!OPENWEATHER_API_KEY) {
  console.warn("OpenWeatherMap API key not found. Weather data will not be available.");
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current weather by coordinates
  app.get("/api/weather/current", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ error: "Weather API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch weather data" });
      }

      const data = await response.json();
      
      const weatherData = {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000, // Convert m to km
        uvIndex: 0, // Will be fetched separately
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name,
        latitude: data.coord.lat,
        longitude: data.coord.lon,
      };

      res.json(weatherData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get weather forecast by coordinates
  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ error: "Weather API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch forecast data" });
      }

      const data = await response.json();
      
      // Process hourly data (next 24 hours)
      const hourly = data.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
      }));

      // Process daily data (next 5 days)
      const dailyMap = new Map();
      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            high: item.main.temp_max,
            low: item.main.temp_min,
            condition: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            temps: [item.main.temp]
          });
        } else {
          const existing = dailyMap.get(date);
          existing.high = Math.max(existing.high, item.main.temp_max);
          existing.low = Math.min(existing.low, item.main.temp_min);
          existing.temps.push(item.main.temp);
        }
      });

      const daily = Array.from(dailyMap.values()).slice(0, 5).map((day: any) => ({
        date: day.date,
        day: day.day,
        high: Math.round(day.high),
        low: Math.round(day.low),
        condition: day.condition,
        description: day.description,
        icon: day.icon,
      }));

      res.json({ hourly, daily });
    } catch (error) {
      console.error("Forecast API error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search locations by name
  app.get("/api/weather/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: "Search query is required" });
      }

      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ error: "Weather API key not configured" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q as string)}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to search locations" });
      }

      const data = await response.json();
      
      const locations = data.map((location: any) => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
        displayName: `${location.name}${location.state ? `, ${location.state}` : ''}, ${location.country}`,
      }));

      res.json(locations);
    } catch (error) {
      console.error("Location search error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

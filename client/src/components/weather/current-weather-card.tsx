import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, Moon, CloudSnow, Eye, Droplets, Wind } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  units: 'metric' | 'imperial';
  convertTemp: (temp: number) => number;
}

const getWeatherIcon = (condition: string, icon: string) => {
  const isNight = icon.includes('n');
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className="w-24 h-24 text-blue-300" />;
  }
  if (conditionLower.includes('snow')) {
    return <CloudSnow className="w-24 h-24 text-white" />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud className="w-24 h-24 text-gray-300" />;
  }
  if (isNight) {
    return <Moon className="w-24 h-24 text-blue-200" />;
  }
  return <Sun className="w-24 h-24 text-yellow-300" />;
};

export default function CurrentWeatherCard({ weather, units, convertTemp }: CurrentWeatherCardProps) {
  return (
    <motion.div
      className="glass-card rounded-3xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="mb-6">
        <motion.div
          className="w-24 h-24 mx-auto mb-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {getWeatherIcon(weather.condition, weather.icon)}
        </motion.div>
        <motion.h1
          className="text-6xl font-light text-white mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {convertTemp(weather.temperature)}°{units === 'metric' ? 'C' : 'F'}
        </motion.h1>
        <p className="text-xl text-white/80 font-medium">{weather.condition}</p>
        <p className="text-sm text-white/60 mt-2 capitalize">{weather.description}</p>
      </div>
      
      <motion.div
        className="grid grid-cols-3 gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Eye className="w-5 h-5 text-white/60 mx-auto mb-2" />
            <p className="text-xs text-white/60">Feels like</p>
            <p className="text-sm font-medium text-white">
              {convertTemp(weather.feelsLike)}°{units === 'metric' ? 'C' : 'F'}
            </p>
          </motion.div>
        </div>
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Droplets className="w-5 h-5 text-white/60 mx-auto mb-2" />
            <p className="text-xs text-white/60">Humidity</p>
            <p className="text-sm font-medium text-white">{weather.humidity}%</p>
          </motion.div>
        </div>
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Wind className="w-5 h-5 text-white/60 mx-auto mb-2" />
            <p className="text-xs text-white/60">Wind</p>
            <p className="text-sm font-medium text-white">
              {Math.round(weather.windSpeed)} {units === 'metric' ? 'km/h' : 'mph'}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

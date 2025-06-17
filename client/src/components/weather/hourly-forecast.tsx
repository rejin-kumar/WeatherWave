import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, Moon, CloudSnow } from "lucide-react";
import type { HourlyWeather } from "@shared/schema";

interface HourlyForecastProps {
  hourlyData: HourlyWeather[];
  convertTemp: (temp: number) => number;
}

const getHourlyIcon = (condition: string, icon: string) => {
  const isNight = icon.includes('n');
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className="w-6 h-6 text-blue-300" />;
  }
  if (conditionLower.includes('snow')) {
    return <CloudSnow className="w-6 h-6 text-white" />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud className="w-6 h-6 text-gray-300" />;
  }
  if (isNight) {
    return <Moon className="w-6 h-6 text-blue-200" />;
  }
  return <Sun className="w-6 h-6 text-yellow-300" />;
};

export default function HourlyForecast({ hourlyData, convertTemp }: HourlyForecastProps) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">24-Hour Forecast</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {hourlyData.map((hour, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0 text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-xs text-white/60 mb-2">
              {index === 0 ? "Now" : hour.time}
            </p>
            <div className="mb-2 flex justify-center">
              {getHourlyIcon(hour.condition, hour.icon)}
            </div>
            <p className="text-sm font-medium text-white">
              {convertTemp(hour.temperature)}°
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

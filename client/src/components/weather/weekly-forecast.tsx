import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, CloudSnow } from "lucide-react";
import type { DailyWeather } from "@shared/schema";

interface WeeklyForecastProps {
  dailyData: DailyWeather[];
  convertTemp: (temp: number) => number;
}

const getDailyIcon = (condition: string, icon: string) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className="w-5 h-5 text-blue-300" />;
  }
  if (conditionLower.includes('snow')) {
    return <CloudSnow className="w-5 h-5 text-white" />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud className="w-5 h-5 text-gray-300" />;
  }
  return <Sun className="w-5 h-5 text-yellow-300" />;
};

export default function WeeklyForecast({ dailyData, convertTemp }: WeeklyForecastProps) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {dailyData.map((day, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between py-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-white/80 font-medium w-16">
                {index === 0 ? "Today" : day.day}
              </span>
              {getDailyIcon(day.condition, day.icon)}
              <span className="text-white/60 text-sm capitalize">{day.description}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">
                {convertTemp(day.high)}°
              </span>
              <span className="text-white/50">
                {convertTemp(day.low)}°
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

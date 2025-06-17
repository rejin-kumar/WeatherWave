import { motion } from "framer-motion";
import { Eye, Sun, Gauge, Thermometer } from "lucide-react";
import type { CurrentWeather } from "@shared/schema";

interface WeatherDetailsGridProps {
  weather: CurrentWeather;
  units: 'metric' | 'imperial';
}

export default function WeatherDetailsGrid({ weather, units }: WeatherDetailsGridProps) {
  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return "Low";
    if (uvIndex <= 5) return "Moderate";
    if (uvIndex <= 7) return "High";
    if (uvIndex <= 10) return "Very High";
    return "Extreme";
  };

  const detailCards = [
    {
      icon: <Eye className="w-6 h-6 text-white/60" />,
      label: "Visibility",
      value: `${Math.round(weather.visibility)} ${units === 'metric' ? 'km' : 'mi'}`,
    },
    {
      icon: <Sun className="w-6 h-6 text-white/60" />,
      label: "UV Index",
      value: weather.uvIndex.toString(),
    },
    {
      icon: <Gauge className="w-6 h-6 text-white/60" />,
      label: "Pressure",
      value: `${Math.round(weather.pressure)} hPa`,
    },
    {
      icon: <Thermometer className="w-6 h-6 text-white/60" />,
      label: "UV Level",
      value: getUVLevel(weather.uvIndex),
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {detailCards.map((card, index) => (
        <motion.div
          key={card.label}
          className="glass-card rounded-2xl p-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="mb-2 flex justify-center">
            {card.icon}
          </div>
          <p className="text-xs text-white/60 mb-1">{card.label}</p>
          <p className="text-lg font-semibold text-white">{card.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

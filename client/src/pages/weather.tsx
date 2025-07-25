import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CurrentWeatherCard from "@/components/weather/current-weather-card";
import HourlyForecast from "@/components/weather/hourly-forecast";
import WeeklyForecast from "@/components/weather/weekly-forecast";
import WeatherDetailsGrid from "@/components/weather/weather-details-grid";
import LocationSearchModal from "@/components/weather/location-search-modal";
import ParticleEffects from "@/components/weather/particle-effects";
import { useWeather } from "@/hooks/use-weather";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WeatherPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const { toast } = useToast();

  // Use selected location or user's current location
  const coords = selectedLocation || location;
  
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    refetch,
  } = useWeather(coords?.lat, coords?.lon);

  useEffect(() => {
    if (locationError && !hasRequestedLocation) {
      setHasRequestedLocation(true);
      toast({
        title: "Location Access",
        description: "Please allow location access or search for a city manually.",
        variant: "default",
      });
    }
  }, [locationError, hasRequestedLocation, toast]);

  useEffect(() => {
    if (error && coords) {
      toast({
        title: "Weather Error",
        description: "Unable to fetch weather data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, coords, toast]);

  const getWeatherGradient = (condition?: string) => {
    if (!condition) return "sunny-gradient";
    
    const conditionLower = condition.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;
    
    if (isNight) return "night-gradient";
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return "rainy-gradient";
    if (conditionLower.includes('cloud')) return "cloudy-gradient";
    if (conditionLower.includes('snow')) return "cloudy-gradient";
    return "sunny-gradient";
  };

  const getParticleType = (condition?: string) => {
    if (!condition) return "clear";
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return "rain";
    if (conditionLower.includes('snow')) return "snow";
    if (conditionLower.includes('cloud')) return "clouds";
    return "clear";
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    setIsSearchOpen(false);
  };

  const handleRefresh = () => {
    refetch();
  };

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  };

  const convertTemp = (temp: number) => {
    if (units === 'imperial') {
      return Math.round(temp * 9/5 + 32);
    }
    return temp;
  };

  const backgroundClass = getWeatherGradient(currentWeather?.condition);
  const particleType = getParticleType(currentWeather?.condition);

  return (
    <div className="min-h-screen overflow-x-hidden font-inter">
      {/* Dynamic Background */}
      <motion.div
        className={`fixed inset-0 transition-all duration-1000 ease-in-out ${backgroundClass}`}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ParticleEffects type={particleType} />
        
        {/* Atmospheric overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </motion.div>

      {/* Main App Container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="relative z-20 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-md lg:max-w-7xl mx-auto">
            <div className="glass-card rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-map-marker-alt text-white text-lg"></i>
                  <span className="text-white font-medium">
                    {currentWeather?.location || "Loading..."}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-orange-200 hover:bg-white/10 transition-colors duration-300"
                    onClick={toggleUnits}
                  >
                    <Thermometer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-orange-200 hover:bg-white/10 transition-colors duration-300"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-orange-200 hover:bg-white/10 transition-colors duration-300"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Weather Display */}
        <main className="relative z-10 flex-1 px-6 pb-6">
          <div className="max-w-md lg:max-w-7xl mx-auto space-y-6 lg:space-y-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="glass-card rounded-3xl p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                  <p className="text-white/80">Loading weather data...</p>
                </motion.div>
              ) : currentWeather ? (
                <motion.div
                  key="weather-data"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6 lg:space-y-0"
                >
                  {/* Desktop Grid Layout */}
                  <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:h-full">
                    {/* Left Column - Current Weather (spans 2 rows on desktop) */}
                    <div className="lg:col-span-1 lg:row-span-2 space-y-6">
                      <CurrentWeatherCard 
                        weather={currentWeather} 
                        units={units}
                        convertTemp={convertTemp}
                      />
                      
                      {/* Weather Details Grid - moved to left column */}
                      <div className="lg:block">
                        <WeatherDetailsGrid 
                          weather={currentWeather} 
                          units={units}
                        />
                      </div>
                    </div>

                    {/* Right Column - Forecasts */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-6">
                      {/* Hourly Forecast */}
                      {forecast?.hourly && (
                        <HourlyForecast 
                          hourlyData={forecast.hourly} 
                          convertTemp={convertTemp}
                        />
                      )}

                      {/* Weekly Forecast */}
                      {forecast?.daily && (
                        <WeeklyForecast 
                          dailyData={forecast.daily} 
                          convertTemp={convertTemp}
                        />
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout - Weather Details (hidden on desktop) */}
                  <div className="lg:hidden">
                    <WeatherDetailsGrid 
                      weather={currentWeather} 
                      units={units}
                    />
                  </div>
                </motion.div>
              ) : !coords ? (
                <motion.div
                  key="no-location"
                  className="glass-card rounded-3xl p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="mb-6">
                    <Search className="w-16 h-16 text-white/60 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">Welcome to Weather App</h2>
                    <p className="text-white/70 mb-6">
                      {locationError 
                        ? "Location access was denied. Search for any city to get started!" 
                        : "Loading your location..."}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-8 py-3"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search for a city
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="error"
                  className="glass-card rounded-3xl p-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-white/80 mb-4">Unable to load weather data</p>
                  <div className="space-y-3">
                    <Button
                      onClick={handleRefresh}
                      className="bg-white/20 hover:bg-white/30 text-white mr-3"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      onClick={() => setIsSearchOpen(true)}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search Different Location
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Location Search Modal */}
      <LocationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}

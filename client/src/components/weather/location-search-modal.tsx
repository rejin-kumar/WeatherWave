import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lon: number) => void;
}

interface Location {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
}

export default function LocationSearchModal({ isOpen, onClose, onLocationSelect }: LocationSearchModalProps) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: locations, isLoading } = useQuery({
    queryKey: ["/api/weather/search", searchTerm],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/weather/search?q=${encodeURIComponent(searchTerm)}`);
      return response.json();
    },
    enabled: searchTerm.length > 2,
  });

  const handleSearch = () => {
    if (query.trim().length > 2) {
      setSearchTerm(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLocationClick = (location: Location) => {
    onLocationSelect(location.lat, location.lon);
    onClose();
    setQuery("");
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Search Location</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter city name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-white/40"
            />
            <Button
              onClick={handleSearch}
              disabled={query.length < 3}
              className="bg-white/20 hover:bg-white/30 text-white px-4"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-4"
              >
                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
              </motion.div>
            )}

            {locations && locations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2 max-h-60 overflow-y-auto"
              >
                {locations.map((location: Location, index: number) => (
                  <motion.button
                    key={`${location.lat}-${location.lon}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLocationClick(location)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-white/60" />
                    <span className="text-white">{location.displayName}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {searchTerm && locations && locations.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4 text-white/60"
              >
                No locations found for "{searchTerm}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

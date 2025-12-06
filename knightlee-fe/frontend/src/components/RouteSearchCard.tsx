import { useState } from "react";
import { Navigation, MapPin } from "lucide-react";

interface RouteSearchCardProps {
  onSearch: (start: string, destination: string) => void;
}

export default function RouteSearchCard({ onSearch }: RouteSearchCardProps) {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (!start || !destination) return;
    onSearch(start, destination);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full p-5 space-y-3">
      {/* Start input */}
      <div className="flex items-center gap-3">
        <Navigation className="w-5 h-5 text-green-600" />
        <input
          type="text"
          placeholder="Start location"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Destination input */}
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-red-600" />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Find Safe Route
      </button>
    </div>
  );
}

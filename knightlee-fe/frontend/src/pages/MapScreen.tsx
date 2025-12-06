import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import Navbar from "../components/Navbar";
import RouteSearchCard from "../components/RouteSearchCard";
import RouteSummaryCard from "../components/RouteSummaryCard";
import ReportIncidentModal from "../components/ReportIncidentModal";
import SOSModal from "../components/SOSModal";

export default function MapScreen() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = "YOUR_MAPBOX_KEY";
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-73.968, 40.7489],
      zoom: 13,
    });
  }, []);

  const handleSearchRoute = () => {
    // Temporary mock data
    const sample = {
      distance: 12.4,
      duration: 26,
      safetyScore: 82,
      type: "safest",
    };
    setSelectedRoute(sample);
  };

  const handleOutsideClick = () => {
    if (selectedRoute) setSelectedRoute(null);
  };

  return (
    <div className=" top-8 relative w-full h-screen bg-gradient-to-b from-[#CCF5E9] to-[#E9FFF7]">
      {/* Navbar at the top, full width */}
      <Navbar />a

      {/* Search card (hidden if summary is showing) */}
      {!selectedRoute && (
        <div className="absolute top-24 left-4 right-4 z-20 max-w-md mx-auto">
          <RouteSearchCard
            onSearch={handleSearchRoute}
            buttonColor="#10B985" // <- apply new green shade
          />
        </div>
      )}

      {/* Route summary replacing search card */}
      {selectedRoute && (
        <div className="absolute top-24 left-4 right-4 z-30 max-w-md mx-auto">
          {/* Click outside to close */}
          <div className="fixed inset-0 z-20" onClick={handleOutsideClick} />

          <div className="relative z-30">
            <button
              onClick={() => setSelectedRoute(null)}
              className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
            <RouteSummaryCard route={selectedRoute} />
          </div>
        </div>
      )}

      {/* Map fills the screen behind UI */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

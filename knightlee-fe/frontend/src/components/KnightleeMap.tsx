import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import api from "../api/client";
import { MapPin, Navigation } from "lucide-react"; // <-- FIXED ICONS

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const KnightleeMap = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("Enter start & destination to analyze route.");

  // Convert place → coordinates using Mapbox geocoder
  const resolveLocation = async (value: string) => {
    if (!value.trim()) return null;

    if (value.includes(",")) {
      const [lng, lat] = value.split(",").map(Number);
      return { lng, lat };
    }

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value
      )}.json?access_token=${mapboxgl.accessToken}&limit=1`
    );

    const data = await res.json();
    if (!data.features?.length) return null;

    return {
      lng: data.features[0].center[0],
      lat: data.features[0].center[1],
    };
  };

  // Map initialization
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [76.27, 9.98],
      zoom: 7,
    });

    mapRef.current = map;

    map.on("load", async () => {
      try {
        const incidentsRes = await api.get("/incidents/geojson/");
        map.addSource("incident-points", {
          type: "geojson",
          data: incidentsRes.data,
        });

        map.addLayer({
          id: "incident-heat",
          type: "heatmap",
          source: "incident-points",
        });

        const blackSpotsRes = await api.get("/blackspots/geojson/");
        map.addSource("blackspots", {
          type: "geojson",
          data: blackSpotsRes.data,
        });

        map.addLayer({
          id: "blackspots-layer",
          type: "circle",
          source: "blackspots",
          paint: {
            "circle-color": "#ff0000",
            "circle-radius": 6,
          },
        });

        console.log("✔ Map loaded");
      } catch {
        console.log("⚠ Error loading layers");
      }
    });
  }, []);

  // Button click handler
  const fetchRouteAndSafety = async () => {
    setLoading(true);

    const startCoords = await resolveLocation(start);
    const endCoords = await resolveLocation(end);

    if (!startCoords || !endCoords) {
      setInfoMsg("❌ Invalid locations entered.");
      setLoading(false);
      return;
    }

    const startParam = `${startCoords.lng},${startCoords.lat}`;
    const endParam = `${endCoords.lng},${endCoords.lat}`;

    try {
      const res = await api.get("/route-analyze/", {
        params: { start: startParam, end: endParam },
      });

      console.log("Backend:", res.data);

      // Normalize backend data
      setAnalysis({
        start: res.data.start,
        end: res.data.end,
        distance_km: res.data.distance_km,
        safety_score: res.data.safety_score,
        blackspots_detected: res.data.blackspots_detected,
        message: res.data.message,
      });

      setInfoMsg("✔ Route analyzed");
    } catch {
      setInfoMsg("❌ Failed to analyze route");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-full p-4 space-y-4">

      {/* INPUT UI */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <Navigation className="text-green-600 w-5" />
          <input
            placeholder="Start location"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-red-600 w-5" />
          <input
            placeholder="Destination"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>

        <button
          onClick={fetchRouteAndSafety}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {loading ? "Analyzing..." : "Find Safe Route"}
        </button>

        <p className="text-sm text-gray-600">{infoMsg}</p>
      </div>

      {/* RESULT CARD — FULL WIDTH UI */}
{analysis && (
  <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 space-y-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Route Safety Overview 🚦
      </h3>

      <div
        className={`px-5 py-2 text-md rounded-full font-bold shadow ${
          analysis.safety_score > 70
            ? "bg-green-100 text-green-700"
            : analysis.safety_score > 40
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {
          analysis.safety_score > 70
            ? "Safe Route"
            : analysis.safety_score > 40
            ? "Moderate Risk"
            : "High Risk"
        }
      </div>
    </div>

    {/* Route Info */}
    <div className="text-xl space-y-2 text-gray-700 dark:text-gray-300">
      <p><b>Start:</b> {analysis.start}</p>
      <p><b>Destination:</b> {analysis.end}</p>
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-3 gap-8 text-center py-6">

      {/* Distance */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl shadow">
          🚗
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {analysis.distance_km}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Distance (km)</p>
      </div>

      {/* Safety Score */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-xl shadow">
          🛡️
        </div>
        <p className={`text-4xl font-bold ${
          analysis.safety_score > 70
            ? "text-green-600"
            : analysis.safety_score > 40
            ? "text-yellow-600"
            : "text-red-600"
        }`}>
          {analysis.safety_score}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Safety Score</p>
      </div>

      {/* Blackspots */}
      <div className="flex flex-col items-center gap-3">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow ${
          analysis.blackspots_detected > 0
            ? "bg-red-200 dark:bg-red-800"
            : "bg-green-200 dark:bg-green-800"
        }`}>
          ⚠️
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {analysis.blackspots_detected}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Blackspots</p>
      </div>

    </div>

    {/* Summary Panel */}
    <div
      className={`rounded-2xl p-6 text-center text-lg font-semibold tracking-wide ${
        analysis.safety_score > 70
          ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800"
          : analysis.safety_score > 40
          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
          : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800"
      }`}
    >
      {analysis.message}
    </div>
  </div>
)}


      {/* MAP */}
      <div ref={mapContainer} className="w-full h-[500px] rounded-xl shadow-md"></div>
    </div>
  );
};

export default KnightleeMap;

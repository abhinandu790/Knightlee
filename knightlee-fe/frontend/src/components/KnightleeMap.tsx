// import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import api from "../api/client";

mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN"; // REQUIRED

type RouteInfo = {
  id: "fastest" | "safest";
  geometry: GeoJSON.LineString;
  safety_score: number;
  distance: number;
  duration: number;
};

type SafePoint = {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
};

const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [start, setStart] = useState("76.2711,9.9816");
  const [end, setEnd] = useState("76.2905,9.9634");

  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [recommendedId, setRecommendedId] =
    useState<"fastest" | "safest" | null>(null);

  const [safePoints, setSafePoints] = useState<SafePoint[]>([]);
  const [infoMsg, setInfoMsg] = useState<string | null>(
    "Enter coordinates or click Safest Route to demo."
  );

  // -------- INIT MAP + HEATMAP ----------
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [76.2711, 9.9816],
      zoom: 12,
    });

    mapRef.current = map;

    map.on("load", async () => {
      try {
        const res = await api.get("/incidents/geojson/");
        map.addSource("incident-points", { type: "geojson", data: res.data });

        map.addLayer({
          id: "incident-heat",
          type: "heatmap",
          source: "incident-points",
          maxzoom: 16,
          paint: {
            "heatmap-weight": ["+", 1, ["get", "upvotes"]],
            "heatmap-radius": 25,
            "heatmap-opacity": 0.8,
          },
        });

        setInfoMsg(
          "Heatmap shows high-risk zones. Right-click to report incident."
        );
      } catch {
        setInfoMsg("Could not load incidents heatmap.");
      }
    });
  }, []);

  // -------- ROUTE HANDLER ----------
  const fetchRoute = async (mode: "fastest" | "safest") => {
    try {
      const res = await api.get("/route/", { params: { start, end, mode } });
      const route = res.data;

      const r: RouteInfo = {
        id: mode,
        geometry: route.routes[0].geometry,
        safety_score: route.safety_score,
        distance: route.routes[0].distance,
        duration: route.routes[0].duration,
      };

      const updated = [...routes.filter((x) => x.id !== mode), r];
      setRoutes(updated);

      if (updated.length === 2) {
        const best = updated.reduce((a, b) =>
          a.safety_score >= b.safety_score ? a : b
        );
        setRecommendedId(best.id);
      }

      drawRouteOnMap(r);
    } catch {
      setInfoMsg("Route fetch failed.");
    }
  };

  const drawRouteOnMap = (route: RouteInfo) => {
    const map = mapRef.current;
    if (!map) return;

    const sourceId = `route-${route.id}`;
    const layerId = `route-layer-${route.id}`;

    if (map.getLayer(layerId)) map.removeLayer(layerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    map.addSource(sourceId, {
      type: "geojson",
      data: { type: "Feature", geometry: route.geometry, properties: {} },
    });

    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-width": route.id === recommendedId ? 6 : 4,
        "line-color":
          route.id === "fastest"
            ? "#888"
            : route.id === "safest"
            ? "#00ff00"
            : "#ff8800",
      },
    });

    const coords = route.geometry.coordinates;
    const bounds = new mapboxgl.LngLatBounds(
      coords[0] as [number, number],
      coords[0] as [number, number]
    );
    coords.forEach((c) => bounds.extend(c as [number, number]));
    map.fitBounds(bounds, { padding: 40 });
  };

  // -------- INCIDENT REPORT ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const reportHandler = (e: any) => {
      const { lng, lat } = e.lngLat;
      const description = prompt("Describe incident at this location");
      if (!description) return;

      api
        .post("/incident/", {
          incident_type: "DARK_ROAD",
          description,
          latitude: lat,
          longitude: lng,
        })
        .then(() => window.location.reload())
        .catch(() => alert("Failed to report incident"));
    };

    map.on("contextmenu", reportHandler);
    return () => map.off("contextmenu", reportHandler);
  }, []);

  // -------- SOS ----------
  const handleSOS = async () => {
    try {
      const [lngStr, latStr] = end.split(",");
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);

      await api.post("/sos/", { latitude, longitude });
      const text = encodeURIComponent(
        `SOS! Need help. Location: https://maps.google.com/?q=${latitude},${longitude}`
      );
      window.open(`https://wa.me/?text=${text}`, "_blank");
    } catch {
      alert("SOS failed");
    }
  };

  // -------- SAFE POINTS ----------
  const handleSafePoints = async () => {
    try {
      const [lngStr, latStr] = end.split(",");
      const res = await api.get("/safe-points/", {
        params: { near: `${latStr},${lngStr}` },
      });

      setSafePoints(res.data.points || []);
      const map = mapRef.current;

      res.data.points.forEach((p: SafePoint) => {
        new mapboxgl.Marker({ color: "#38bdf8" })
          .setLngLat([p.longitude, p.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<b>${p.name}</b><br>${p.type}`))
          .addTo(map!);
      });
    } catch {
      alert("Failed safe points fetch");
    }
  };

  return (
    <div className="relative w-full h-screen text-white">
      {/* UI Controls */}
      <div className="absolute top-3 left-3 z-20 bg-black/70 p-4 rounded-lg space-y-2">
        <input
          className="text-black p-1 rounded w-full"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start: lng,lat"
        />
        <input
          className="text-black p-1 rounded w-full"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End: lng,lat"
        />

        <button onClick={() => fetchRoute("fastest")} className="btn">
          Fastest Route
        </button>
        <button onClick={() => fetchRoute("safest")} className="btn">
          Safest Route
        </button>

        <button onClick={handleSafePoints} className="btn bg-blue-400">
          Safe Points Nearby
        </button>

        <button onClick={handleSOS} className="btn bg-red-500">
          🚨 SOS
        </button>

        <button onClick={onLogout} className="btn bg-gray-600">
          Logout
        </button>

        <p className="text-sm opacity-80">{infoMsg}</p>
      </div>

      {/* MAP */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default KnightleeMap;

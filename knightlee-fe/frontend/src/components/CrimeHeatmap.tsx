import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// ✅ Mapbox token — make sure you have VITE_MAPBOX_TOKEN in your .env
// .env.local →  VITE_MAPBOX_TOKEN=pk.eyJ1Ijoi.... (your token)
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

interface GeoJSONFeature {
  type: "Feature";
  properties: {
    city: string;
    crime_description: string | null;
    crime_domain: string | null;
    victim_age?: number | null;
    weapon_used?: string | null;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

const CrimeHeatmap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [data, setData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 1️⃣ Fetch GeoJSON from Django backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/crime-heatmap/");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as GeoJSONData;
        setData(json);
        setFetchError(null);
      } catch (error: any) {
        console.error("Error fetching heatmap data:", error);
        setFetchError(error?.message || "Failed to fetch heatmap data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2️⃣ Initialize Mapbox + layers when data is ready
  useEffect(() => {
    if (!mapContainerRef.current || !data || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [78.9629, 20.5937], // Center on India
      zoom: 4,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Source
      map.addSource("crime-heat-source", {
        type: "geojson",
        data: data,
      });

      // 🔥 Detailed heatmap layer
      map.addLayer({
        id: "crime-heat-layer",
        type: "heatmap",
        source: "crime-heat-source",
        maxzoom: 15,
        paint: {
          // Weight based on crime_domain (you can tweak values)
          "heatmap-weight": [
            "case",
            ["==", ["get", "crime_domain"], "Violent Crime"],
            2.0,
            ["==", ["get", "crime_domain"], "Fire Accident"],
            1.5,
            ["==", ["get", "crime_domain"], "Other Crime"],
            1.0,
            0.7, // default
          ],

          // Radius grows with zoom for more detail
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            15,
            8,
            40,
            12,
            80,
          ],

          // Detailed color ramp from low → high density
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 0, 0)",
            0.1,
            "rgba(0, 255, 0, 0.4)", // low - soft green
            0.3,
            "yellow",
            0.5,
            "orange",
            0.7,
            "red",
            1,
            "purple", // extreme hotspot
          ],

          // Heatmap opacity fades a bit when zooming in
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            0.9,
            10,
            0.4,
          ],
        },
      });

      // 🎯 Circle layer for detailed points when zoomed in
      map.addLayer({
        id: "crime-point-layer",
        type: "circle",
        source: "crime-heat-source",
        minzoom: 7,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            4,
            14,
            12,
          ],
          "circle-color": [
            "match",
            ["get", "crime_domain"],
            "Violent Crime",
            "red",
            "Fire Accident",
            "orange",
            "Other Crime",
            "yellow",
            /* default */ "cyan",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 0.5,
          "circle-opacity": 0.9,
        },
      });

      // 📝 Popup on click for detailed info
      map.on("click", "crime-point-layer", (e) => {
        const feature = e.features?.[0] as any;
        if (!feature) return;

        const props = feature.properties || {};
        const coords = (feature.geometry?.coordinates || []).slice();

        const city = props.city || "Unknown city";
        const crime = props.crime_description || "Unknown crime";
        const domain = props.crime_domain || "Unknown domain";

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(
            `
            <div style="font-size: 13px;">
              <strong>${city}</strong><br/>
              <strong>Crime:</strong> ${crime}<br/>
              <strong>Type:</strong> ${domain}
            </div>
          `.trim()
          )
          .addTo(map);
      });

      // Change cursor on hover over points
      map.on("mouseenter", "crime-point-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "crime-point-layer", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [data]);

  // 3️⃣ Basic loading / error UI
  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        Loading heatmap...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-red-500">
        Failed to load heatmap data: {fetchError}
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "600px", borderRadius: "12px" }}
    />
  );
};

export default CrimeHeatmap;

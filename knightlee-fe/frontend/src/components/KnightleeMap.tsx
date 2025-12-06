
// import React, { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import api from "../api/client";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg";

// interface BackendRouteAnalyze {
//   distance_km: number;
//   safety_score: number;
//   blackspots_detected: number;
//   message: string;
//   start: string;
//   end: string;
// }

// const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
//   const mapContainer = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);

//   const [start, setStart] = useState("");
//   const [end, setEnd] = useState("");
//   const [analysis, setAnalysis] = useState<BackendRouteAnalyze | null>(null);
//   const [infoMsg, setInfoMsg] = useState<string | null>(
//     "Enter start & destination, then click Analyze Route."
//   );
//   const [loading, setLoading] = useState(false);

//   // ---------- Convert input to coordinates ----------
//   const resolveToCoords = async (value: string) => {
//     const trimmed = value.trim();
//     if (!trimmed) throw new Error("Empty value");

//     if (trimmed.includes(",")) {
//       const [lngStr, latStr] = trimmed.split(",");
//       const lng = Number(lngStr);
//       const lat = Number(latStr);
//       if (!isNaN(lng) && !isNaN(lat)) return { lng, lat };
//     }

//     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//       trimmed
//     )}.json?country=in&limit=1&autocomplete=true&access_token=${mapboxgl.accessToken}`;

//     const res = await fetch(url);
//     const data = await res.json();

//     if (!data.features?.length) throw new Error("Place not found");

//     const [lng, lat] = data.features[0].center;
//     return { lng, lat };
//   };

//   // ---------- Initialize map ----------
//   useEffect(() => {
//     if (mapRef.current) return;

//     const map = new mapboxgl.Map({
//       container: mapContainer.current as HTMLElement,
//       style: "mapbox://styles/mapbox/dark-v11",
//       center: [76.2711, 9.9816],
//       zoom: 12,
//     });

//     mapRef.current = map;

//     map.on("load", async () => {
//       try {
//         // Heatmap
//         const incidentsRes = await api.get("/incidents/geojson/");
//         map.addSource("incident-points", {
//           type: "geojson",
//           data: incidentsRes.data,
//         });

//         map.addLayer({
//           id: "incident-heat",
//           type: "heatmap",
//           source: "incident-points",
//           paint: {
//             "heatmap-weight": ["+", 1, ["get", "upvotes"]],
//             "heatmap-radius": 25,
//             "heatmap-opacity": 0.8,
//           },
//         });

//         // Blackspots
//         const blackspotsRes = await api.get("/blackspots/geojson/");
//         map.addSource("blackspots", {
//           type: "geojson",
//           data: blackspotsRes.data,
//         });

//         map.addLayer({
//           id: "blackspots-layer",
//           type: "circle",
//           source: "blackspots",
//           paint: {
//             "circle-color": [
//               "case",
//               [">=", ["get", "severity"], 4],
//               "#ff0000",
//               ["==", ["get", "severity"], 3],
//               "#ff8800",
//               "#00cc44",
//             ],
//             "circle-radius": 8,
//             "circle-opacity": 0.9,
//           },
//         });

//         setInfoMsg("🔥 Map Loaded with Live Safety Data");
//       } catch {
//         setInfoMsg("⚠ Error loading map data");
//       }
//     });
//   }, []);

//   // ---------- Call backend ----------
//   const fetchRouteAndSafety = async () => {
//     try {
//       if (!start.trim() || !end.trim()) {
//         setInfoMsg("⚠ Enter valid start & destination");
//         return;
//       }

//       setLoading(true);
//       setAnalysis(null);

//       const startCoords = await resolveToCoords(start);
//       const endCoords = await resolveToCoords(end);

//       const startParam = `${startCoords.lng},${startCoords.lat}`;
//       const endParam = `${endCoords.lng},${endCoords.lat}`;

//       const res = await api.get("/route-analyze/", {
//         params: { start: startParam, end: endParam },
//       });

//       console.log("Backend response:", res.data);

//       // Normalize response for card
//       setAnalysis({
//         distance_km: res.data.distance_km,
//         safety_score: res.data.safety_score,
//         blackspots_detected: res.data.blackspots_detected,
//         message: res.data.message || "Analysis Completed",
//         start: res.data.start,
//         end: res.data.end,
//       });

//       setInfoMsg("🛣 Route analyzed successfully!");
//     } catch (err) {
//       console.error(err);
//       setInfoMsg("❌ Failed to analyze route");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- UI ----------
//   return (
//     <div className="w-full h-full flex flex-col gap-3 p-4">

//       {/* INPUT SECTION */}
//       <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
//         <input
//           className="w-full px-2 py-2 text-sm border rounded"
//           placeholder="Start: place or coordinates"
//           value={start}
//           onChange={(e) => setStart(e.target.value)}
//         />

//         <input
//           className="w-full px-2 py-2 text-sm border rounded"
//           placeholder="Destination: place or coordinates"
//           value={end}
//           onChange={(e) => setEnd(e.target.value)}
//         />

//         <button
//           onClick={fetchRouteAndSafety}
//           disabled={loading}
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 disabled:opacity-50"
//         >
//           {loading ? "Analyzing..." : "Analyze Route"}
//         </button>

//         <p className="text-xs text-gray-600">{infoMsg}</p>
//       </div>

//       {/* RESULT CARD */}
//       {analysis && (
//         <div className="bg-white p-4 rounded-xl shadow-lg border">
//           <h2 className="font-bold text-gray-700 text-lg mb-2">Route Safety Report 🚦</h2>

//           <p><b>Start:</b> {analysis.start}</p>
//           <p><b>End:</b> {analysis.end}</p>
//           <p><b>Distance:</b> {analysis.distance_km} km</p>

//           <p>
//             <b>Safety Score:</b>{" "}
//             <span className={
//               analysis.safety_score > 70
//                 ? "text-green-600 font-bold"
//                 : analysis.safety_score > 40
//                 ? "text-yellow-600 font-bold"
//                 : "text-red-600 font-bold"
//             }>
//               {analysis.safety_score} / 100
//             </span>
//           </p>

//           <p><b>Blackspots Found:</b> {analysis.blackspots_detected}</p>

//           <p className="text-sm italic text-gray-500 mt-2">
//             {analysis.message}
//           </p>
//         </div>
//       )}

//       {/* MAP */}
//       <div ref={mapContainer} className="w-full h-[500px] rounded-xl shadow-md" />
//     </div>
//   );
// };

// export default KnightleeMap;
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import api from "../api/client";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const KnightleeMap = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  // Resolve place → coordinates
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

  // Initialize map
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
        console.log("Error loading layers");
      }
    });
  }, []);

  // Analyze Route
  const fetchRouteAndSafety = async () => {
    setLoading(true);
    setInfoMsg("");

    const startCoords = await resolveLocation(start);
    const endCoords = await resolveLocation(end);

    if (!startCoords || !endCoords) {
      setInfoMsg("❌ Could not resolve locations.");
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

      // Normalize backend response format
      setAnalysis({
        start: res.data.start ?? startParam,
        end: res.data.end ?? endParam,
        distance_km: Number(res.data.distance_km ?? 0),
        safety_score: Number(res.data.safety_score ?? 0),
        blackspots_detected: Number(res.data.blackspots_detected ?? 0),
        message: res.data.message ?? "Route processed.",
      });

      setInfoMsg("✔ Analysis Completed");
    } catch {
      setInfoMsg("❌ Error analyzing route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full h-full flex flex-col gap-3">

      {/* Input section */}
      <div className="bg-white p-4 rounded-xl shadow-md space-y-2">
        <input
          placeholder="Starting location"
          className="border rounded px-3 py-2"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          placeholder="Destination"
          className="border rounded px-3 py-2"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button
          onClick={fetchRouteAndSafety}
          disabled={loading || !start.trim() || !end.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Route"}
        </button>

        <p className="text-gray-500 text-sm">{infoMsg}</p>
      </div>

      {/* Output Card */}
      {analysis && (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-2">Route Safety Report 🚦</h2>

          <p><b>Start:</b> {analysis.start}</p>
          <p><b>End:</b> {analysis.end}</p>
          <p><b>Distance:</b> {analysis.distance_km} km</p>

          <p>
            <b>Safety Score:</b>{" "}
            <span
              className={`font-bold ${
                analysis.safety_score > 70
                  ? "text-green-600"
                  : analysis.safety_score > 40
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {analysis.safety_score} / 100
            </span>
          </p>

          <p><b>Blackspots Detected:</b> {analysis.blackspots_detected}</p>
          <p className="text-gray-500 italic mt-2">{analysis.message}</p>
        </div>
      )}

      {/* Map */}
      <div ref={mapContainer} className="rounded-xl shadow-md w-full h-[500px]" />
    </div>
  );
};

export default KnightleeMap;

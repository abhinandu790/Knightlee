// // // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // import mapboxgl from "mapbox-gl";
// // // // // import api from "../api/client";
// // // // // import React, { useEffect, useRef, useState } from "react";

// // // // // mapboxgl.accessToken = "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg"; // REQUIRED
// // // // // interface RouteBlackspotFeature {
// // // // //   type: "Feature";
// // // // //   properties: {
// // // // //     id: number;
// // // // //     name: string;
// // // // //     severity: number;
// // // // //     distance_km: number;
// // // // //   };
// // // // //   geometry: {
// // // // //     type: "Point";
// // // // //     coordinates: [number, number];
// // // // //   };
// // // // // }

// // // // // interface RouteBlackspotGeoJSON {
// // // // //   type: "FeatureCollection";
// // // // //   features: RouteBlackspotFeature[];
// // // // // }

// // // // // interface RouteSafetySummary {
// // // // //   route_distance_km: number;
// // // // //   total_blackspots: number;
// // // // //   avg_severity: number;
// // // // //   max_severity: number;
// // // // //   min_distance_km: number | null;
// // // // //   buffer_km: number;
// // // // //   safety_percentage: number;
// // // // // }

// // // // // interface RouteBlackspotResponse {
// // // // //   summary: RouteSafetySummary;
// // // // //   geojson: RouteBlackspotGeoJSON;
// // // // // }

// // // // // type RouteInfo = {
// // // // //   id: "fastest" | "safest";
// // // // //   geometry: GeoJSON.LineString;
// // // // //   safety_score: number;
// // // // //   distance: number;
// // // // //   duration: number;
// // // // // };

// // // // // type SafePoint = {
// // // // //   name: string;
// // // // //   type: string;
// // // // //   latitude: number;
// // // // //   longitude: number;
// // // // // };

// // // // // const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
// // // // //   const mapContainer = useRef<HTMLDivElement | null>(null);
// // // // //   const mapRef = useRef<mapboxgl.Map | null>(null);

// // // // //   const [start, setStart] = useState("76.2711,9.9816");
// // // // //   const [end, setEnd] = useState("76.2905,9.9634");

// // // // //   const [routes, setRoutes] = useState<RouteInfo[]>([]);
// // // // //   const [recommendedId, setRecommendedId] =
// // // // //     useState<"fastest" | "safest" | null>(null);

// // // // //   const [safePoints, setSafePoints] = useState<SafePoint[]>([]);
// // // // //   const [infoMsg, setInfoMsg] = useState<string | null>(
// // // // //     "Enter coordinates or click Safest Route to demo."
// // // // //   );

// // // // //   // -------- INIT MAP + HEATMAP ----------
// // // // //   useEffect(() => {
// // // // //     if (mapRef.current) return;

// // // // //     const map = new mapboxgl.Map({
// // // // //       container: mapContainer.current as HTMLElement,
// // // // //       style: "mapbox://styles/mapbox/dark-v11",
// // // // //       center: [76.2711, 9.9816],
// // // // //       zoom: 12,
// // // // //     });

// // // // //     mapRef.current = map;

// // // // //    map.on("load", async () => {
// // // // //   try {
// // // // //     // 🔥 INCIDENT HEATMAP
// // // // //     const incidentsRes = await api.get("/incidents/geojson/");
// // // // //     map.addSource("incident-points", {
// // // // //       type: "geojson",
// // // // //       data: incidentsRes.data,
// // // // //     });

// // // // //     map.addLayer({
// // // // //       id: "incident-heat",
// // // // //       type: "heatmap",
// // // // //       source: "incident-points",
// // // // //       maxzoom: 16,
// // // // //       paint: {
// // // // //         "heatmap-weight": ["+", 1, ["get", "upvotes"]],
// // // // //         "heatmap-radius": 25,
// // // // //         "heatmap-opacity": 0.8,
// // // // //       },
// // // // //     });

// // // // //     // ⚠️ BLACKSPOTS POINT MARKERS
// // // // //     const blackspotsRes = await api.get("/blackspots/geojson/");
// // // // //     map.addSource("blackspots", {
// // // // //       type: "geojson",
// // // // //       data: blackspotsRes.data,
// // // // //     });

// // // // //     map.addLayer({
// // // // //       id: "blackspots-layer",
// // // // //       type: "circle",
// // // // //       source: "blackspots",
// // // // //       paint: {
// // // // //         // severity-based colors
// // // // //         "circle-color": [
// // // // //           "case",
// // // // //           [">=", ["get", "severity"], 4], "#ff0000",   // 🔴 very high risk
// // // // //           ["==", ["get", "severity"], 3], "#ff8800",   // 🟠 medium risk
// // // // //           "#00cc44"                                    // 🟢 low risk
// // // // //         ],
// // // // //         "circle-radius": 8,
// // // // //         "circle-opacity": 0.9,
// // // // //       },
// // // // //     });

// // // // //     // Popup on click
// // // // //     map.on("click", "blackspots-layer", (e: any) => {
// // // // //       const props = e.features[0].properties;
// // // // //       const [lng, lat] = e.features[0].geometry.coordinates;

// // // // //       new mapboxgl.Popup()
// // // // //         .setLngLat([lng, lat])
// // // // //         .setHTML(`
// // // // //           <b>${props.name}</b><br/>
// // // // //           Severity: <strong>${props.severity}</strong>
// // // // //         `)
// // // // //         .addTo(map);
// // // // //     });

// // // // //     setInfoMsg("Heatmap + Blackspots Loaded ✔");
// // // // //   } catch (err) {
// // // // //     setInfoMsg("❌ Error loading map data");
// // // // //   }
// // // // // });

// // // // //   }, []);

// // // // //   // -------- ROUTE HANDLER ----------
// // // // //   const fetchRoute = async (mode: "fastest" | "safest") => {
// // // // //     try {
// // // // //       const res = await api.get("/route/", { params: { start, end, mode } });
// // // // //       const route = res.data;

// // // // //       const r: RouteInfo = {
// // // // //         id: mode,
// // // // //         geometry: route.routes[0].geometry,
// // // // //         safety_score: route.safety_score,
// // // // //         distance: route.routes[0].distance,
// // // // //         duration: route.routes[0].duration,
// // // // //       };

// // // // //       const updated = [...routes.filter((x) => x.id !== mode), r];
// // // // //       setRoutes(updated);

// // // // //       if (updated.length === 2) {
// // // // //         const best = updated.reduce((a, b) =>
// // // // //           a.safety_score >= b.safety_score ? a : b
// // // // //         );
// // // // //         setRecommendedId(best.id);
// // // // //       }

// // // // //       drawRouteOnMap(r);
// // // // //     } catch {
// // // // //       setInfoMsg("Route fetch failed.");
// // // // //     }
// // // // //   };

// // // // //   const drawRouteOnMap = (route: RouteInfo) => {
// // // // //     const map = mapRef.current;
// // // // //     if (!map) return;

// // // // //     const sourceId = `route-${route.id}`;
// // // // //     const layerId = `route-layer-${route.id}`;

// // // // //     if (map.getLayer(layerId)) map.removeLayer(layerId);
// // // // //     if (map.getSource(sourceId)) map.removeSource(sourceId);

// // // // //     map.addSource(sourceId, {
// // // // //       type: "geojson",
// // // // //       data: { type: "Feature", geometry: route.geometry, properties: {} },
// // // // //     });

// // // // //     map.addLayer({
// // // // //       id: layerId,
// // // // //       type: "line",
// // // // //       source: sourceId,
// // // // //       layout: { "line-cap": "round", "line-join": "round" },
// // // // //       paint: {
// // // // //         "line-width": route.id === recommendedId ? 6 : 4,
// // // // //         "line-color":
// // // // //           route.id === "fastest"
// // // // //             ? "#888"
// // // // //             : route.id === "safest"
// // // // //             ? "#00ff00"
// // // // //             : "#ff8800",
// // // // //       },
// // // // //     });

// // // // //     const coords = route.geometry.coordinates;
// // // // //     const bounds = new mapboxgl.LngLatBounds(
// // // // //       coords[0] as [number, number],
// // // // //       coords[0] as [number, number]
// // // // //     );
// // // // //     coords.forEach((c) => bounds.extend(c as [number, number]));
// // // // //     map.fitBounds(bounds, { padding: 40 });
// // // // //   };

// // // // //   // -------- INCIDENT REPORT ----------
// // // // //   useEffect(() => {
// // // // //     const map = mapRef.current;
// // // // //     if (!map) return;

// // // // //     const reportHandler = (e: any) => {
// // // // //       const { lng, lat } = e.lngLat;
// // // // //       const description = prompt("Describe incident at this location");
// // // // //       if (!description) return;

// // // // //       api
// // // // //         .post("/incident/", {
// // // // //           incident_type: "DARK_ROAD",
// // // // //           description,
// // // // //           latitude: lat,
// // // // //           longitude: lng,
// // // // //         })
// // // // //         .then(() => window.location.reload())
// // // // //         .catch(() => alert("Failed to report incident"));
// // // // //     };

// // // // //     map.on("contextmenu", reportHandler);
// // // // //     return () => map.off("contextmenu", reportHandler);
// // // // //   }, []);

// // // // //   // -------- SOS ----------
// // // // //   const handleSOS = async () => {
// // // // //     try {
// // // // //       const [lngStr, latStr] = end.split(",");
// // // // //       const latitude = parseFloat(latStr);
// // // // //       const longitude = parseFloat(lngStr);

// // // // //       await api.post("/sos/", { latitude, longitude });
// // // // //       const text = encodeURIComponent(
// // // // //         `SOS! Need help. Location: https://maps.google.com/?q=${latitude},${longitude}`
// // // // //       );
// // // // //       window.open(`https://wa.me/?text=${text}`, "_blank");
// // // // //     } catch {
// // // // //       alert("SOS failed");
// // // // //     }
// // // // //   };

// // // // //   // -------- SAFE POINTS ----------
// // // // //   const handleSafePoints = async () => {
// // // // //     try {
// // // // //       const [lngStr, latStr] = end.split(",");
// // // // //       const res = await api.get("/safe-points/", {
// // // // //         params: { near: `${latStr},${lngStr}` },
// // // // //       });

// // // // //       setSafePoints(res.data.points || []);
// // // // //       const map = mapRef.current;

// // // // //       res.data.points.forEach((p: SafePoint) => {
// // // // //         new mapboxgl.Marker({ color: "#38bdf8" })
// // // // //           .setLngLat([p.longitude, p.latitude])
// // // // //           .setPopup(new mapboxgl.Popup().setHTML(`<b>${p.name}</b><br>${p.type}`))
// // // // //           .addTo(map!);
// // // // //       });
// // // // //     } catch {
// // // // //       alert("Failed safe points fetch");
// // // // //     }
// // // // //   };

// // // // // return (
// // // // //   {routeSafety && (
// // // // //   <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg w-80 space-y-2 border border-slate-700">
// // // // //     <div className="flex items-center justify-between">
// // // // //       <span className="text-sm font-semibold">Route Safety</span>
// // // // //       <span
// // // // //         className={`text-lg font-bold ${
// // // // //           routeSafety.safety_percentage >= 80
// // // // //             ? "text-green-400"
// // // // //             : routeSafety.safety_percentage >= 50
// // // // //             ? "text-yellow-400"
// // // // //             : "text-red-400"
// // // // //         }`}
// // // // //       >
// // // // //         {routeSafety.safety_percentage}%
// // // // //       </span>
// // // // //     </div>

// // // // //     <div className="text-xs text-slate-300">
// // // // //       Distance: <strong>{routeSafety.route_distance_km} km</strong>
// // // // //     </div>

// // // // //     <div className="text-xs text-slate-300">
// // // // //       Blackspots on route:{" "}
// // // // //       <strong>{routeSafety.total_blackspots}</strong>{" "}
// // // // //       (avg severity {routeSafety.avg_severity}, max {routeSafety.max_severity})
// // // // //     </div>

// // // // //     {routeSafety.min_distance_km !== null && (
// // // // //       <div className="text-xs text-slate-300">
// // // // //         Closest blackspot to route:{" "}
// // // // //         <strong>{routeSafety.min_distance_km} km</strong>
// // // // //       </div>
// // // // //     )}

// // // // //     <div className="w-full bg-slate-700 rounded-full h-2 mt-1 overflow-hidden">
// // // // //       <div
// // // // //         className={`h-2 rounded-full ${
// // // // //           routeSafety.safety_percentage >= 80
// // // // //             ? "bg-green-400"
// // // // //             : routeSafety.safety_percentage >= 50
// // // // //             ? "bg-yellow-400"
// // // // //             : "bg-red-500"
// // // // //         }`}
// // // // //         style={{ width: `${routeSafety.safety_percentage}%` }}
// // // // //       />
// // // // //     </div>
// // // // //   </div>
// // // // // )}
// // // // // );
// // // // // };

// // // // // export default KnightleeMap;
// // // // import mapboxgl from "mapbox-gl";
// // // // import api from "../api/client";
// // // // import React, { useEffect, useRef, useState } from "react";

// // // // mapboxgl.accessToken =
// // // //   "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg";

// // // // interface RouteBlackspotFeature {
// // // //   type: "Feature";
// // // //   properties: {
// // // //     id: number;
// // // //     name: string;
// // // //     severity: number;
// // // //     distance_km: number;
// // // //   };
// // // //   geometry: {
// // // //     type: "Point";
// // // //     coordinates: [number, number];
// // // //   };
// // // // }

// // // // interface RouteBlackspotGeoJSON {
// // // //   type: "FeatureCollection";
// // // //   features: RouteBlackspotFeature[];
// // // // }

// // // // interface RouteSafetySummary {
// // // //   route_distance_km: number;
// // // //   total_blackspots: number;
// // // //   avg_severity: number;
// // // //   max_severity: number;
// // // //   min_distance_km: number | null;
// // // //   buffer_km: number;
// // // //   safety_percentage: number;
// // // // }

// // // // interface RouteBlackspotResponse {
// // // //   summary: RouteSafetySummary;
// // // //   geojson: RouteBlackspotGeoJSON;
// // // // }

// // // // type RouteInfo = {
// // // //   id: "fastest" | "safest";
// // // //   geometry: GeoJSON.LineString;
// // // //   safety_score: number;
// // // //   distance: number;
// // // //   duration: number;
// // // // };

// // // // type SafePoint = {
// // // //   name: string;
// // // //   type: string;
// // // //   latitude: number;
// // // //   longitude: number;
// // // // };

// // // // const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
// // // //   const mapContainer = useRef<HTMLDivElement | null>(null);
// // // //   const mapRef = useRef<mapboxgl.Map | null>(null);

// // // //   const [start, setStart] = useState("76.2711,9.9816");
// // // //   const [end, setEnd] = useState("76.2905,9.9634");

// // // //   const [routes, setRoutes] = useState<RouteInfo[]>([]);
// // // //   const [recommendedId, setRecommendedId] =
// // // //     useState<"fastest" | "safest" | null>(null);

// // // //   const [safePoints, setSafePoints] = useState<SafePoint[]>([]);
// // // //   const [infoMsg, setInfoMsg] = useState<string | null>(
// // // //     "Enter coordinates or click Safest Route to demo."
// // // //   );

// // // //   // ⭐ NEW: Route safety + blackspots along the chosen route
// // // //   const [routeSafety, setRouteSafety] = useState<RouteSafetySummary | null>(
// // // //     null
// // // //   );
// // // //   const [routeBlackspots, setRouteBlackspots] =
// // // //     useState<RouteBlackspotGeoJSON | null>(null);

// // // //   // -------- Helper to parse "lng,lat" string ----------
// // // //   const parseLngLat = (value: string) => {
// // // //     const [lngStr, latStr] = value.split(",");
// // // //     return {
// // // //       lng: parseFloat(lngStr),
// // // //       lat: parseFloat(latStr),
// // // //     };
// // // //   };

// // // //   // -------- INIT MAP + INCIDENT HEATMAP + STATIC BLACKSPOTS ----------
// // // //   useEffect(() => {
// // // //     if (mapRef.current) return;

// // // //     const map = new mapboxgl.Map({
// // // //       container: mapContainer.current as HTMLElement,
// // // //       style: "mapbox://styles/mapbox/dark-v11",
// // // //       center: [76.2711, 9.9816],
// // // //       zoom: 12,
// // // //     });

// // // //     mapRef.current = map;

// // // //     map.on("load", async () => {
// // // //       try {
// // // //         // 🔥 INCIDENT HEATMAP
// // // //         const incidentsRes = await api.get("/incidents/geojson/");
// // // //         map.addSource("incident-points", {
// // // //           type: "geojson",
// // // //           data: incidentsRes.data,
// // // //         });

// // // //         map.addLayer({
// // // //           id: "incident-heat",
// // // //           type: "heatmap",
// // // //           source: "incident-points",
// // // //           maxzoom: 16,
// // // //           paint: {
// // // //             "heatmap-weight": ["+", 1, ["get", "upvotes"]],
// // // //             "heatmap-radius": 25,
// // // //             "heatmap-opacity": 0.8,
// // // //           },
// // // //         });

// // // //         // ⚠️ STATIC BLACKSPOTS POINT MARKERS (global)
// // // //         const blackspotsRes = await api.get("/blackspots/geojson/");
// // // //         map.addSource("blackspots", {
// // // //           type: "geojson",
// // // //           data: blackspotsRes.data,
// // // //         });

// // // //         map.addLayer({
// // // //           id: "blackspots-layer",
// // // //           type: "circle",
// // // //           source: "blackspots",
// // // //           paint: {
// // // //             "circle-color": [
// // // //               "case",
// // // //               [">=", ["get", "severity"], 4],
// // // //               "#ff0000", // 🔴 very high risk
// // // //               ["==", ["get", "severity"], 3],
// // // //               "#ff8800", // 🟠 medium risk
// // // //               "#00cc44", // 🟢 low risk
// // // //             ],
// // // //             "circle-radius": 8,
// // // //             "circle-opacity": 0.9,
// // // //           },
// // // //         });

// // // //         map.on("click", "blackspots-layer", (e: any) => {
// // // //           const props = e.features[0].properties;
// // // //           const [lng, lat] = e.features[0].geometry.coordinates;

// // // //           new mapboxgl.Popup()
// // // //             .setLngLat([lng, lat])
// // // //             .setHTML(`
// // // //               <b>${props.name}</b><br/>
// // // //               Severity: <strong>${props.severity}</strong>
// // // //             `)
// // // //             .addTo(map);
// // // //         });

// // // //         setInfoMsg("Heatmap + Blackspots Loaded ✔");
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setInfoMsg("❌ Error loading map data");
// // // //       }
// // // //     });
// // // //   }, []);

// // // //   // -------- NEW: Fetch blackspots along current route ----------
// // // //   const fetchRouteBlackspots = async (
// // // //     startCoords: { lng: number; lat: number },
// // // //     endCoords: { lng: number; lat: number }
// // // //   ) => {
// // // //     try {
// // // //       const res = await api.get<RouteBlackspotResponse>("/blackspots-route/", {
// // // //         params: {
// // // //           start_lng: startCoords.lng,
// // // //           start_lat: startCoords.lat,
// // // //           end_lng: endCoords.lng,
// // // //           end_lat: endCoords.lat,
// // // //           buffer_km: 1, // 1km corridor around the route
// // // //         },
// // // //       });

// // // //       setRouteSafety(res.data.summary);
// // // //       setRouteBlackspots(res.data.geojson);
// // // //       setInfoMsg(
// // // //         `Found ${res.data.summary.total_blackspots} blackspots along this route`
// // // //       );
// // // //     } catch (err) {
// // // //       console.error("Failed to fetch route blackspots:", err);
// // // //       setRouteSafety(null);
// // // //       setRouteBlackspots(null);
// // // //       setInfoMsg("Could not analyze blackspots along this route.");
// // // //     }
// // // //   };

// // // //   // -------- ROUTE HANDLER ----------
// // // //   // const fetchRoute = async (mode: "fastest" | "safest") => {
// // // //   //   try {
// // // //   //     const startCoords = parseLngLat(start);
// // // //   //     const endCoords = parseLngLat(end);

// // // //   //     const res = await api.get("/route/", { params: { start, end, mode } });
// // // //   //     const route = res.data;

// // // //   //     const r: RouteInfo = {
// // // //   //       id: mode,
// // // //   //       geometry: route.routes[0].geometry,
// // // //   //       safety_score: route.safety_score,
// // // //   //       distance: route.routes[0].distance,
// // // //   //       duration: route.routes[0].duration,
// // // //   //     };

// // // //   //     const updated = [...routes.filter((x) => x.id !== mode), r];
// // // //   //     setRoutes(updated);

// // // //   //     if (updated.length === 2) {
// // // //   //       const best = updated.reduce((a, b) =>
// // // //   //         a.safety_score >= b.safety_score ? a : b
// // // //   //       );
// // // //   //       setRecommendedId(best.id);
// // // //   //     }

// // // //   //     drawRouteOnMap(r);

// // // //   //     // ⭐ AFTER we have a route, analyze blackspots along this path
// // // //   //     fetchRouteBlackspots(startCoords, endCoords);
// // // //   //   } catch (err) {
// // // //   //     console.error(err);
// // // //   //     setInfoMsg("Route fetch failed.");
// // // //   //   }
// // // //   // };
// // // // const fetchRoute = async (mode: "fastest" | "safest") => {
// // // //   try {
// // // //     const startCoords = parseLngLat(start);
// // // //     const endCoords = parseLngLat(end);

// // // //     const res = await api.get("/route/", { params: { start, end, mode } });
// // // //     const data = res.data;
// // // //     console.log("Route API response:", data);

// // // //     // Try to find the actual route object in the response
// // // //     // Adjust this to match your backend if needed.
// // // //     const apiRoutes = Array.isArray(data.routes) ? data.routes : [];
// // // //     const firstRoute = apiRoutes.length > 0 ? apiRoutes[0] : null;

// // // //     if (!firstRoute || !firstRoute.geometry) {
// // // //       console.error("Unexpected /route/ response shape:", data);
// // // //       setInfoMsg("Route format from server is not as expected.");
// // // //       return;
// // // //     }

// // // //     const r: RouteInfo = {
// // // //       id: mode,
// // // //       geometry: firstRoute.geometry,
// // // //       safety_score: data.safety_score ?? 0,
// // // //       distance: firstRoute.distance ?? 0,
// // // //       duration: firstRoute.duration ?? 0,
// // // //     };

// // // //     const updated = [...routes.filter((x) => x.id !== mode), r];
// // // //     setRoutes(updated);

// // // //     if (updated.length === 2) {
// // // //       const best = updated.reduce((a, b) =>
// // // //         a.safety_score >= b.safety_score ? a : b
// // // //       );
// // // //       setRecommendedId(best.id);
// // // //     }

// // // //     drawRouteOnMap(r);

// // // //     // ⭐ AFTER we have a route, analyze blackspots along this path
// // // //     fetchRouteBlackspots(startCoords, endCoords);
// // // //   } catch (err) {
// // // //     console.error("Route fetch failed:", err);
// // // //     setInfoMsg("Route fetch failed.");
// // // //   }
// // // // };

// // // //   const drawRouteOnMap = (route: RouteInfo) => {
// // // //     const map = mapRef.current;
// // // //     if (!map) return;

// // // //     const sourceId = `route-${route.id}`;
// // // //     const layerId = `route-layer-${route.id}`;

// // // //     if (map.getLayer(layerId)) map.removeLayer(layerId);
// // // //     if (map.getSource(sourceId)) map.removeSource(sourceId);

// // // //     map.addSource(sourceId, {
// // // //       type: "geojson",
// // // //       data: { type: "Feature", geometry: route.geometry, properties: {} },
// // // //     });

// // // //     map.addLayer({
// // // //       id: layerId,
// // // //       type: "line",
// // // //       source: sourceId,
// // // //       layout: { "line-cap": "round", "line-join": "round" },
// // // //       paint: {
// // // //         "line-width": route.id === recommendedId ? 6 : 4,
// // // //         "line-color":
// // // //           route.id === "fastest"
// // // //             ? "#888"
// // // //             : route.id === "safest"
// // // //             ? "#00ff00"
// // // //             : "#ff8800",
// // // //       },
// // // //     });

// // // //     const coords = route.geometry.coordinates;
// // // //     const bounds = new mapboxgl.LngLatBounds(
// // // //       coords[0] as [number, number],
// // // //       coords[0] as [number, number]
// // // //     );
// // // //     coords.forEach((c) => bounds.extend(c as [number, number]));
// // // //     map.fitBounds(bounds, { padding: 40 });
// // // //   };

// // // //   // -------- NEW: Show route-specific blackspots on map ----------
// // // //   useEffect(() => {
// // // //     const map = mapRef.current;
// // // //     if (!map) return;

// // // //     const sourceId = "route-blackspots-source";
// // // //     const layerId = "route-blackspots-layer";

// // // //     if (!routeBlackspots) {
// // // //       // If no route blackspots, remove layer if exists
// // // //       if (map.getLayer(layerId)) map.removeLayer(layerId);
// // // //       if (map.getSource(sourceId)) map.removeSource(sourceId);
// // // //       return;
// // // //     }

// // // //     if (!map.getSource(sourceId)) {
// // // //       map.addSource(sourceId, {
// // // //         type: "geojson",
// // // //         data: routeBlackspots,
// // // //       });
// // // //     } else {
// // // //       (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(
// // // //         routeBlackspots
// // // //       );
// // // //     }

// // // //     if (!map.getLayer(layerId)) {
// // // //       map.addLayer({
// // // //         id: layerId,
// // // //         type: "circle",
// // // //         source: sourceId,
// // // //         paint: {
// // // //           "circle-radius": [
// // // //             "interpolate",
// // // //             ["linear"],
// // // //             ["get", "severity"],
// // // //             1,
// // // //             5,
// // // //             3,
// // // //             8,
// // // //             5,
// // // //             12,
// // // //           ],
// // // //           "circle-color": [
// // // //             "interpolate",
// // // //             ["linear"],
// // // //             ["get", "severity"],
// // // //             1,
// // // //             "#22c55e", // green
// // // //             3,
// // // //             "#eab308", // yellow
// // // //             5,
// // // //             "#ef4444", // red
// // // //           ],
// // // //           "circle-stroke-color": "#000000",
// // // //           "circle-stroke-width": 1,
// // // //           "circle-opacity": 0.95,
// // // //         },
// // // //       });

// // // //       map.on("click", layerId, (e: any) => {
// // // //         const feature = e.features[0];
// // // //         const props = feature.properties;
// // // //         const [lng, lat] = feature.geometry.coordinates;

// // // //         new mapboxgl.Popup()
// // // //           .setLngLat([lng, lat])
// // // //           .setHTML(
// // // //             `
// // // //             <div style="font-size: 13px;">
// // // //               <strong>${props.name}</strong><br/>
// // // //               Severity: ${props.severity}<br/>
// // // //               Distance from route: ${props.distance_km} km
// // // //             </div>
// // // //           `.trim()
// // // //           )
// // // //           .addTo(map);
// // // //       });

// // // //       map.on("mouseenter", layerId, () => {
// // // //         map.getCanvas().style.cursor = "pointer";
// // // //       });
// // // //       map.on("mouseleave", layerId, () => {
// // // //         map.getCanvas().style.cursor = "";
// // // //       });
// // // //     }
// // // //   }, [routeBlackspots]);

// // // //   // -------- INCIDENT REPORT (right-click) ----------
// // // //   useEffect(() => {
// // // //     const map = mapRef.current;
// // // //     if (!map) return;

// // // //     const reportHandler = (e: any) => {
// // // //       const { lng, lat } = e.lngLat;
// // // //       const description = prompt("Describe incident at this location");
// // // //       if (!description) return;

// // // //       api
// // // //         .post("/incident/", {
// // // //           incident_type: "DARK_ROAD",
// // // //           description,
// // // //           latitude: lat,
// // // //           longitude: lng,
// // // //         })
// // // //         .then(() => window.location.reload())
// // // //         .catch(() => alert("Failed to report incident"));
// // // //     };

// // // //     map.on("contextmenu", reportHandler);
// // // //     return () => map.off("contextmenu", reportHandler);
// // // //   }, []);

// // // //   // -------- SOS ----------
// // // //   const handleSOS = async () => {
// // // //     try {
// // // //       const [lngStr, latStr] = end.split(",");
// // // //       const latitude = parseFloat(latStr);
// // // //       const longitude = parseFloat(lngStr);

// // // //       await api.post("/sos/", { latitude, longitude });
// // // //       const text = encodeURIComponent(
// // // //         `SOS! Need help. Location: https://maps.google.com/?q=${latitude},${longitude}`
// // // //       );
// // // //       window.open(`https://wa.me/?text=${text}`, "_blank");
// // // //     } catch {
// // // //       alert("SOS failed");
// // // //     }
// // // //   };

// // // //   // -------- SAFE POINTS ----------
// // // //   const handleSafePoints = async () => {
// // // //     try {
// // // //       const [lngStr, latStr] = end.split(",");
// // // //       const res = await api.get("/safe-points/", {
// // // //         params: { near: `${latStr},${lngStr}` },
// // // //       });

// // // //       setSafePoints(res.data.points || []);
// // // //       const map = mapRef.current;

// // // //       res.data.points.forEach((p: SafePoint) => {
// // // //         new mapboxgl.Marker({ color: "#38bdf8" })
// // // //           .setLngLat([p.longitude, p.latitude])
// // // //           .setPopup(
// // // //             new mapboxgl.Popup().setHTML(`<b>${p.name}</b><br>${p.type}`)
// // // //           )
// // // //           .addTo(map!);
// // // //       });
// // // //     } catch {
// // // //       alert("Failed safe points fetch");
// // // //     }
// // // //   };

// // // //   // -------- RENDER ----------
// // // //   return (
// // // //     <div className="relative w-full h-full">
// // // //       {/* Map container */}
// // // //       <div ref={mapContainer} className="w-full h-full" />

// // // //       {/* Top controls */}
// // // //       <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg space-y-2 w-80 border border-slate-700">
// // // //         <div className="flex justify-between items-center mb-1">
// // // //           <span className="text-sm font-semibold">Knightlee</span>
// // // //           <button
// // // //             onClick={onLogout}
// // // //             className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
// // // //           >
// // // //             Logout
// // // //           </button>
// // // //         </div>

// // // //         <div className="space-y-1 text-xs">
// // // //           <div>
// // // //             <label className="block text-slate-300">Start (lng,lat)</label>
// // // //             <input
// // // //               className="w-full text-black text-xs px-1 py-1 rounded"
// // // //               value={start}
// // // //               onChange={(e) => setStart(e.target.value)}
// // // //             />
// // // //           </div>
// // // //           <div>
// // // //             <label className="block text-slate-300">End (lng,lat)</label>
// // // //             <input
// // // //               className="w-full text-black text-xs px-1 py-1 rounded"
// // // //               value={end}
// // // //               onChange={(e) => setEnd(e.target.value)}
// // // //             />
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex gap-2 mt-2">
// // // //           <button
// // // //             onClick={() => fetchRoute("fastest")}
// // // //             className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded"
// // // //           >
// // // //             Fastest Route
// // // //           </button>
// // // //           <button
// // // //             onClick={() => fetchRoute("safest")}
// // // //             className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded"
// // // //           >
// // // //             Safest Route
// // // //           </button>
// // // //         </div>

// // // //         <div className="flex gap-2 mt-2">
// // // //           <button
// // // //             onClick={handleSafePoints}
// // // //             className="flex-1 text-xs bg-sky-600 hover:bg-sky-500 px-2 py-1 rounded"
// // // //           >
// // // //             Nearby Safe Points
// // // //           </button>
// // // //           <button
// // // //             onClick={handleSOS}
// // // //             className="flex-1 text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
// // // //           >
// // // //             SOS
// // // //           </button>
// // // //         </div>

// // // //         {infoMsg && (
// // // //           <div className="mt-2 text-[11px] text-slate-300">{infoMsg}</div>
// // // //         )}
// // // //       </div>

// // // //       {/* ⭐ Route Safety Card */}
// // // //       {routeSafety && (
// // // //         <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg w-80 space-y-2 border border-slate-700">
// // // //           <div className="flex items-center justify-between">
// // // //             <span className="text-sm font-semibold">Route Safety</span>
// // // //             <span
// // // //               className={`text-lg font-bold ${
// // // //                 routeSafety.safety_percentage >= 80
// // // //                   ? "text-green-400"
// // // //                   : routeSafety.safety_percentage >= 50
// // // //                   ? "text-yellow-400"
// // // //                   : "text-red-400"
// // // //               }`}
// // // //             >
// // // //               {routeSafety.safety_percentage}%
// // // //             </span>
// // // //           </div>

// // // //           <div className="text-xs text-slate-300">
// // // //             Distance: <strong>{routeSafety.route_distance_km} km</strong>
// // // //           </div>

// // // //           <div className="text-xs text-slate-300">
// // // //             Blackspots on route:{" "}
// // // //             <strong>{routeSafety.total_blackspots}</strong> (avg severity{" "}
// // // //             {routeSafety.avg_severity}, max {routeSafety.max_severity})
// // // //           </div>

// // // //           {routeSafety.min_distance_km !== null && (
// // // //             <div className="text-xs text-slate-300">
// // // //               Closest blackspot to route:{" "}
// // // //               <strong>{routeSafety.min_distance_km} km</strong>
// // // //             </div>
// // // //           )}

// // // //           <div className="w-full bg-slate-700 rounded-full h-2 mt-1 overflow-hidden">
// // // //             <div
// // // //               className={`h-2 rounded-full ${
// // // //                 routeSafety.safety_percentage >= 80
// // // //                   ? "bg-green-400"
// // // //                   : routeSafety.safety_percentage >= 50
// // // //                   ? "bg-yellow-400"
// // // //                   : "bg-red-500"
// // // //               }`}
// // // //               style={{ width: `${routeSafety.safety_percentage}%` }}
// // // //             />
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default KnightleeMap;
// // // import mapboxgl from "mapbox-gl";
// // // import api from "../api/client";
// // // import React, { useEffect, useRef, useState } from "react";

// // // mapboxgl.accessToken =
// // //   "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg";

// // // interface RouteBlackspotFeature {
// // //   type: "Feature";
// // //   properties: {
// // //     id: number;
// // //     name: string;
// // //     severity: number;
// // //     distance_km: number;
// // //   };
// // //   geometry: {
// // //     type: "Point";
// // //     coordinates: [number, number];
// // //   };
// // // }

// // // interface RouteBlackspotGeoJSON {
// // //   type: "FeatureCollection";
// // //   features: RouteBlackspotFeature[];
// // // }

// // // interface RouteSafetySummary {
// // //   route_distance_km: number;
// // //   total_blackspots: number;
// // //   avg_severity: number;
// // //   max_severity: number;
// // //   min_distance_km: number | null;
// // //   buffer_km: number;
// // //   safety_percentage: number;
// // // }

// // // interface RouteBlackspotResponse {
// // //   summary: RouteSafetySummary;
// // //   geojson: RouteBlackspotGeoJSON;
// // // }

// // // type RouteInfo = {
// // //   id: "fastest" | "safest";
// // //   geometry: GeoJSON.LineString;
// // //   safety_score: number;
// // //   distance: number;
// // //   duration: number;
// // // };

// // // const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
// // //   const mapContainer = useRef<HTMLDivElement | null>(null);
// // //   const mapRef = useRef<mapboxgl.Map | null>(null);

// // //   // You can type either "76.2711,9.9816" OR "CUSAT", "Kakkanad" etc.
// // //   const [start, setStart] = useState("");
// // //   const [end, setEnd] = useState("");

// // //   const [routes, setRoutes] = useState<RouteInfo[]>([]);
// // //   const [recommendedId, setRecommendedId] =
// // //     useState<"fastest" | "safest" | null>(null);

// // //   const [infoMsg, setInfoMsg] = useState<string | null>(
// // //     "Enter a place name or coordinates, then click Analyze Route."
// // //   );

// // //   const [routeSafety, setRouteSafety] = useState<RouteSafetySummary | null>(
// // //     null
// // //   );
// // //   const [routeBlackspots, setRouteBlackspots] =
// // //     useState<RouteBlackspotGeoJSON | null>(null);

// // //   // -------- HELPERS ----------

// // //   // Accepts either "lng,lat" or "some place name"
// // // // Accepts either "lng,lat" or "some place name"
// // // // Accepts either "lng,lat" or place name (prefer place)
// // // const resolveToCoords = async (value: string) => {
// // //   const trimmed = value.trim();

// // //   if (!trimmed) {
// // //     throw new Error("Empty value");
// // //   }

// // //   // If user *does* paste "lng,lat", still support it
// // //   if (trimmed.includes(",")) {
// // //     const [lngStr, latStr] = trimmed.split(",").map((x) => x.trim());
// // //     const lng = Number(lngStr);
// // //     const lat = Number(latStr);
// // //     if (!isNaN(lng) && !isNaN(lat)) {
// // //       return { lng, lat };
// // //     }
// // //   }

// // //   // Treat as place name → Mapbox geocoding
// // //   // country=in : any place in India, no hardcoded bbox
// // //   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
// // //     trimmed
// // //   )}.json?country=in&limit=1&autocomplete=true&access_token=${
// // //     mapboxgl.accessToken
// // //   }`;

// // //   const res = await fetch(url);
// // //   const data = await res.json();
// // //   console.log("Geocode result for", trimmed, data);

// // //   if (!data.features || data.features.length === 0) {
// // //     throw new Error("Place not found");
// // //   }

// // //   const [lng, lat] = data.features[0].center;
// // //   return { lng, lat };
// // // };



// // //   // -------- INIT MAP + GLOBAL HEATMAP / BLACKSPOTS ----------

// // //   useEffect(() => {
// // //     if (mapRef.current) return;

// // //     const map = new mapboxgl.Map({
// // //       container: mapContainer.current as HTMLElement,
// // //       style: "mapbox://styles/mapbox/dark-v11",
// // //       center: [76.2711, 9.9816],
// // //       zoom: 12,
// // //     });

// // //     mapRef.current = map;

// // //     map.on("load", async () => {
// // //       try {
// // //         const incidentsRes = await api.get("/incidents/geojson/");
// // //         map.addSource("incident-points", {
// // //           type: "geojson",
// // //           data: incidentsRes.data,
// // //         });

// // //         map.addLayer({
// // //           id: "incident-heat",
// // //           type: "heatmap",
// // //           source: "incident-points",
// // //           maxzoom: 16,
// // //           paint: {
// // //             "heatmap-weight": ["+", 1, ["get", "upvotes"]],
// // //             "heatmap-radius": 25,
// // //             "heatmap-opacity": 0.8,
// // //           },
// // //         });

// // //         const blackspotsRes = await api.get("/blackspots/geojson/");
// // //         map.addSource("blackspots", {
// // //           type: "geojson",
// // //           data: blackspotsRes.data,
// // //         });

// // //         map.addLayer({
// // //           id: "blackspots-layer",
// // //           type: "circle",
// // //           source: "blackspots",
// // //           paint: {
// // //             "circle-color": [
// // //               "case",
// // //               [">=", ["get", "severity"], 4],
// // //               "#ff0000",
// // //               ["==", ["get", "severity"], 3],
// // //               "#ff8800",
// // //               "#00cc44",
// // //             ],
// // //             "circle-radius": 8,
// // //             "circle-opacity": 0.9,
// // //           },
// // //         });

// // //         map.on("click", "blackspots-layer", (e: any) => {
// // //           const props = e.features[0].properties;
// // //           const [lng, lat] = e.features[0].geometry.coordinates;

// // //           new mapboxgl.Popup()
// // //             .setLngLat([lng, lat])
// // //             .setHTML(
// // //               `<b>${props.name}</b><br/>Severity: <strong>${props.severity}</strong>`
// // //             )
// // //             .addTo(map);
// // //         });

// // //         setInfoMsg("Heatmap + Blackspots Loaded ✔");
// // //       } catch (err) {
// // //         console.error(err);
// // //         setInfoMsg("❌ Error loading map data");
// // //       }
// // //     });
// // //   }, []);

// // //   // -------- BLACKSPOTS ALONG CURRENT ROUTE ----------

// // //   const fetchRouteBlackspots = async (
// // //     startCoords: { lng: number; lat: number },
// // //     endCoords: { lng: number; lat: number }
// // //   ) => {
// // //     try {
// // //       const res = await api.get<RouteBlackspotResponse>("/blackspots-route/", {
// // //         params: {
// // //           start_lng: startCoords.lng,
// // //           start_lat: startCoords.lat,
// // //           end_lng: endCoords.lng,
// // //           end_lat: endCoords.lat,
// // //           buffer_km: 1,
// // //         },
// // //       });

// // //       setRouteSafety(res.data.summary);
// // //       setRouteBlackspots(res.data.geojson);
// // //       setInfoMsg(
// // //         `Found ${res.data.summary.total_blackspots} blackspots along this route`
// // //       );
// // //     } catch (err) {
// // //       console.error("Failed to fetch route blackspots:", err);
// // //       setRouteSafety(null);
// // //       setRouteBlackspots(null);
// // //       setInfoMsg("Could not analyze blackspots along this route.");
// // //     }
// // //   };

// // //   // -------- ROUTE HANDLER (single button → safest mode) ----------

// // //   const fetchRoute = async () => {
// // //     try {
// // //       if (!start.trim() || !end.trim()) {
// // //       setInfoMsg("Please enter both start and end places.");
// // //       return;
// // //     }

// // //       setInfoMsg("Resolving places and fetching route…");

// // //       // Convert input to coords (place OR lng,lat)
// // //           const startCoords = await resolveToCoords(start);
// // //           const endCoords = await resolveToCoords(end);

// // //       const startParam = `${startCoords.lng},${startCoords.lat}`;
// // //       const endParam = `${endCoords.lng},${endCoords.lat}`;

// // //       // Keep normalized coords in state
// // //       setStart(startParam);
// // //       setEnd(endParam);

// // //       const res = await api.get("/route/", {
// // //         params: { start: startParam, end: endParam, mode: "safest" },
// // //       });

// // //       const data = res.data;
// // //       console.log("Route API response:", data);

// // //       const apiRoutes = Array.isArray(data.routes) ? data.routes : [];
// // //       const firstRoute = apiRoutes.length > 0 ? apiRoutes[0] : null;

// // //       if (!firstRoute || !firstRoute.geometry) {
// // //         console.error("Unexpected /route/ response shape:", data);
// // //         setInfoMsg("Route format from server is not as expected.");
// // //         return;
// // //       }

// // //       const r: RouteInfo = {
// // //         id: "safest",
// // //         geometry: firstRoute.geometry,
// // //         safety_score: data.safety_score ?? 0,
// // //         distance: firstRoute.distance ?? 0,
// // //         duration: firstRoute.duration ?? 0,
// // //       };

// // //       const updated = [...routes.filter((x) => x.id !== "safest"), r];
// // //       setRoutes(updated);
// // //       setRecommendedId("safest");

// // //       drawRouteOnMap(r);
// // //       await fetchRouteBlackspots(startCoords, endCoords);
// // //     } catch (err: any) {
// // //       console.error("Route fetch failed:", err);
// // //       setInfoMsg(
// // //         err?.message === "Place not found"
// // //           ? "Could not find one of those places. Try a more specific name or coordinates."
// // //           : "Route fetch failed."
// // //       );
// // //     }
// // //   };

// // //   // -------- DRAW ROUTE ON MAP ----------

// // //   const drawRouteOnMap = (route: RouteInfo) => {
// // //     const map = mapRef.current;
// // //     if (!map) return;

// // //     const sourceId = `route-${route.id}`;
// // //     const layerId = `route-layer-${route.id}`;

// // //     if (map.getLayer(layerId)) map.removeLayer(layerId);
// // //     if (map.getSource(sourceId)) map.removeSource(sourceId);

// // //     map.addSource(sourceId, {
// // //       type: "geojson",
// // //       data: { type: "Feature", geometry: route.geometry, properties: {} },
// // //     });

// // //     map.addLayer({
// // //       id: layerId,
// // //       type: "line",
// // //       source: sourceId,
// // //       layout: { "line-cap": "round", "line-join": "round" },
// // //       paint: {
// // //         "line-width": 5,
// // //         "line-color": "#00ff00",
// // //       },
// // //     });

// // //     const coords = route.geometry.coordinates;
// // //     const bounds = new mapboxgl.LngLatBounds(
// // //       coords[0] as [number, number],
// // //       coords[0] as [number, number]
// // //     );
// // //     coords.forEach((c) => bounds.extend(c as [number, number]));
// // //     map.fitBounds(bounds, { padding: 40 });
// // //   };

// // //   // -------- ROUTE-SPECIFIC BLACKSPOT LAYER ----------

// // //   useEffect(() => {
// // //     const map = mapRef.current;
// // //     if (!map) return;

// // //     const sourceId = "route-blackspots-source";
// // //     const layerId = "route-blackspots-layer";

// // //     if (!routeBlackspots) {
// // //       if (map.getLayer(layerId)) map.removeLayer(layerId);
// // //       if (map.getSource(sourceId)) map.removeSource(sourceId);
// // //       return;
// // //     }

// // //     if (!map.getSource(sourceId)) {
// // //       map.addSource(sourceId, {
// // //         type: "geojson",
// // //         data: routeBlackspots,
// // //       });
// // //     } else {
// // //       (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(
// // //         routeBlackspots
// // //       );
// // //     }

// // //     if (!map.getLayer(layerId)) {
// // //       map.addLayer({
// // //         id: layerId,
// // //         type: "circle",
// // //         source: sourceId,
// // //         paint: {
// // //           "circle-radius": [
// // //             "interpolate",
// // //             ["linear"],
// // //             ["get", "severity"],
// // //             1,
// // //             5,
// // //             3,
// // //             8,
// // //             5,
// // //             12,
// // //           ],
// // //           "circle-color": [
// // //             "interpolate",
// // //             ["linear"],
// // //             ["get", "severity"],
// // //             1,
// // //             "#22c55e",
// // //             3,
// // //             "#eab308",
// // //             5,
// // //             "#ef4444",
// // //           ],
// // //           "circle-stroke-color": "#000000",
// // //           "circle-stroke-width": 1,
// // //           "circle-opacity": 0.95,
// // //         },
// // //       });

// // //       map.on("click", layerId, (e: any) => {
// // //         const feature = e.features[0];
// // //         const props = feature.properties;
// // //         const [lng, lat] = feature.geometry.coordinates;

// // //         new mapboxgl.Popup()
// // //           .setLngLat([lng, lat])
// // //           .setHTML(
// // //             `<div style="font-size: 13px;">
// // //               <strong>${props.name}</strong><br/>
// // //               Severity: ${props.severity}<br/>
// // //               Distance from route: ${props.distance_km} km
// // //             </div>`
// // //           )
// // //           .addTo(map);
// // //       });

// // //       map.on("mouseenter", layerId, () => {
// // //         map.getCanvas().style.cursor = "pointer";
// // //       });
// // //       map.on("mouseleave", layerId, () => {
// // //         map.getCanvas().style.cursor = "";
// // //       });
// // //     }
// // //   }, [routeBlackspots]);

// // //   // -------- INCIDENT REPORT (right-click) ----------

// // //   useEffect(() => {
// // //     const map = mapRef.current;
// // //     if (!map) return;

// // //     const reportHandler = (e: any) => {
// // //       const { lng, lat } = e.lngLat;
// // //       const description = prompt("Describe incident at this location");
// // //       if (!description) return;

// // //       api
// // //         .post("/incident/", {
// // //           incident_type: "DARK_ROAD",
// // //           description,
// // //           latitude: lat,
// // //           longitude: lng,
// // //         })
// // //         .then(() => window.location.reload())
// // //         .catch(() => alert("Failed to report incident"));
// // //     };

// // //     map.on("contextmenu", reportHandler);
// // //     return () => map.off("contextmenu", reportHandler);
// // //   }, []);

// // //   // -------- RENDER ----------

// // //   return (
// // //     <div className="relative w-full h-full">
// // //       <div ref={mapContainer} className="w-full h-full" />

// // //       {/* Top controls card */}
// // //       <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg space-y-2 w-80 border border-slate-700">
// // //         <div className="flex justify-between items-center mb-1">
// // //           <span className="text-sm font-semibold">Knightlee</span>
// // //           <button
// // //             onClick={onLogout}
// // //             className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
// // //           >
// // //             Logout
// // //           </button>
// // //         </div>

// // //         <div className="space-y-1 text-xs">
// // //           <div>
// // //             <label className="block text-slate-300">
// // //               Start (place or lng,lat)
// // //             </label>
// // //             <input
// // //               className="w-full text-black text-xs px-1 py-1 rounded"
// // //               value={start}
// // //               onChange={(e) => setStart(e.target.value)}
// // //               placeholder="e.g. Kakkanad or 76.27,9.98"
// // //             />
// // //           </div>
// // //           <div>
// // //             <label className="block text-slate-300">
// // //               End (place or lng,lat)
// // //             </label>
// // //             <input
// // //               className="w-full text-black text-xs px-1 py-1 rounded"
// // //               value={end}
// // //               onChange={(e) => setEnd(e.target.value)}
// // //               placeholder="e.g. CUSAT or 76.29,9.96"
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* ONLY ONE BUTTON NOW */}
// // //         <button
// // //           onClick={fetchRoute}
// // //           className="mt-3 w-full text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-2 rounded"
// // //         >
// // //           Analyze Route (Safest)
// // //         </button>

// // //         {infoMsg && (
// // //           <div className="mt-2 text-[11px] text-slate-300">{infoMsg}</div>
// // //         )}
// // //       </div>

// // //       {/* Route Safety card */}
// // //       {routeSafety && (
// // //         <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg w-80 space-y-2 border border-slate-700">
// // //           <div className="flex items-center justify-between">
// // //             <span className="text-sm font-semibold">Route Safety</span>
// // //             <span
// // //               className={`text-lg font-bold ${
// // //                 routeSafety.safety_percentage >= 80
// // //                   ? "text-green-400"
// // //                   : routeSafety.safety_percentage >= 50
// // //                   ? "text-yellow-400"
// // //                   : "text-red-400"
// // //               }`}
// // //             >
// // //               {routeSafety.safety_percentage}%
// // //             </span>
// // //           </div>

// // //           <div className="text-xs text-slate-300">
// // //             Distance: <strong>{routeSafety.route_distance_km} km</strong>
// // //           </div>

// // //           <div className="text-xs text-slate-300">
// // //             Blackspots on route:{" "}
// // //             <strong>{routeSafety.total_blackspots}</strong> (avg severity{" "}
// // //             {routeSafety.avg_severity}, max {routeSafety.max_severity})
// // //           </div>

// // //           {routeSafety.min_distance_km !== null && (
// // //             <div className="text-xs text-slate-300">
// // //               Closest blackspot to route:{" "}
// // //               <strong>{routeSafety.min_distance_km} km</strong>
// // //             </div>
// // //           )}

// // //           <div className="w-full bg-slate-700 rounded-full h-2 mt-1 overflow-hidden">
// // //             <div
// // //               className={`h-2 rounded-full ${
// // //                 routeSafety.safety_percentage >= 80
// // //                   ? "bg-green-400"
// // //                   : routeSafety.safety_percentage >= 50
// // //                   ? "bg-yellow-400"
// // //                   : "bg-red-500"
// // //               }`}
// // //               style={{ width: `${routeSafety.safety_percentage}%` }}
// // //             />
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default KnightleeMap;
// // import mapboxgl from "mapbox-gl";
// // import api from "../api/client";
// // import React, { useEffect, useRef, useState } from "react";

// // mapboxgl.accessToken =
// //   "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg";

// // interface RouteBlackspotFeature {
// //   type: "Feature";
// //   properties: {
// //     id: number;
// //     name: string;
// //     severity: number;
// //     distance_km: number;
// //   };
// //   geometry: {
// //     type: "Point";
// //     coordinates: [number, number];
// //   };
// // }

// // interface RouteBlackspotGeoJSON {
// //   type: "FeatureCollection";
// //   features: RouteBlackspotFeature[];
// // }

// // interface RouteSafetySummary {
// //   route_distance_km: number;
// //   total_blackspots: number;
// //   avg_severity: number;
// //   max_severity: number;
// //   min_distance_km: number | null;
// //   buffer_km: number;
// //   safety_percentage: number;
// // }

// // type RouteInfo = {
// //   id: "safest";
// //   geometry: GeoJSON.LineString;
// //   safety_score: number;
// //   distance: number;
// //   duration: number;
// // };

// // interface RouteAnalyzeResponse {
// //   route: {
// //     geometry: GeoJSON.LineString;
// //     distance: number;
// //     duration: number;
// //   };
// //   summary: RouteSafetySummary;
// //   blackspots_geojson: RouteBlackspotGeoJSON;
// //   safety_score: number;
// // }

// // const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
// //   const mapContainer = useRef<HTMLDivElement | null>(null);
// //   const mapRef = useRef<mapboxgl.Map | null>(null);

// //   const [start, setStart] = useState(""); // place names
// //   const [end, setEnd] = useState("");

// //   const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
// //   const [routeSafety, setRouteSafety] = useState<RouteSafetySummary | null>(
// //     null
// //   );
// //   const [routeBlackspots, setRouteBlackspots] =
// //     useState<RouteBlackspotGeoJSON | null>(null);

// //   const [infoMsg, setInfoMsg] = useState<string | null>(
// //     "Enter two places, then click Analyze Route."
// //   );

// //   // ---------- Geocode helper ----------
// //   const resolveToCoords = async (value: string) => {
// //     const trimmed = value.trim();
// //     if (!trimmed) throw new Error("Empty value");

// //     // Allow pasted lng,lat too
// //     if (trimmed.includes(",")) {
// //       const [lngStr, latStr] = trimmed.split(",").map((x) => x.trim());
// //       const lng = Number(lngStr);
// //       const lat = Number(latStr);
// //       if (!isNaN(lng) && !isNaN(lat)) return { lng, lat };
// //     }

// //     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
// //       trimmed
// //     )}.json?country=in&limit=1&autocomplete=true&access_token=${
// //       mapboxgl.accessToken
// //     }`;

// //     const res = await fetch(url);
// //     const data = await res.json();
// //     console.log("Geocode result for", trimmed, data);

// //     if (!data.features || data.features.length === 0) {
// //       throw new Error("Place not found");
// //     }

// //     const [lng, lat] = data.features[0].center;
// //     return { lng, lat };
// //   };

// //   // ---------- Init map + static layers ----------
// //   useEffect(() => {
// //     if (mapRef.current) return;

// //     const map = new mapboxgl.Map({
// //       container: mapContainer.current as HTMLElement,
// //       style: "mapbox://styles/mapbox/dark-v11",
// //       center: [76.2711, 9.9816],
// //       zoom: 12,
// //     });

// //     mapRef.current = map;

// //     map.on("load", async () => {
// //       try {
// //         const incidentsRes = await api.get("/incidents/geojson/");
// //         map.addSource("incident-points", {
// //           type: "geojson",
// //           data: incidentsRes.data,
// //         });

// //         map.addLayer({
// //           id: "incident-heat",
// //           type: "heatmap",
// //           source: "incident-points",
// //           maxzoom: 16,
// //           paint: {
// //             "heatmap-weight": ["+", 1, ["get", "upvotes"]],
// //             "heatmap-radius": 25,
// //             "heatmap-opacity": 0.8,
// //           },
// //         });

// //         const blackspotsRes = await api.get("/blackspots/geojson/");
// //         map.addSource("blackspots", {
// //           type: "geojson",
// //           data: blackspotsRes.data,
// //         });

// //         map.addLayer({
// //           id: "blackspots-layer",
// //           type: "circle",
// //           source: "blackspots",
// //           paint: {
// //             "circle-color": [
// //               "case",
// //               [">=", ["get", "severity"], 4],
// //               "#ff0000",
// //               ["==", ["get", "severity"], 3],
// //               "#ff8800",
// //               "#00cc44",
// //             ],
// //             "circle-radius": 8,
// //             "circle-opacity": 0.9,
// //           },
// //         });

// //         map.on("click", "blackspots-layer", (e: any) => {
// //           const props = e.features[0].properties;
// //           const [lng, lat] = e.features[0].geometry.coordinates;

// //           new mapboxgl.Popup()
// //             .setLngLat([lng, lat])
// //             .setHTML(
// //               `<b>${props.name}</b><br/>Severity: <strong>${props.severity}</strong>`
// //             )
// //             .addTo(map);
// //         });

// //         setInfoMsg("Heatmap + Blackspots Loaded ✔");
// //       } catch (err) {
// //         console.error(err);
// //         setInfoMsg("❌ Error loading map data");
// //       }
// //     });
// //   }, []);

// //   // ---------- Analyze Route (single button) ----------
// //   const fetchRouteAndSafety = async () => {
// //     try {
// //       if (!start.trim() || !end.trim()) {
// //         setInfoMsg("Please enter both start and end places.");
// //         return;
// //       }

// //       setInfoMsg("Resolving places and analyzing route…");

// //       const startCoords = await resolveToCoords(start);
// //       const endCoords = await resolveToCoords(end);

// //       const startParam = `${startCoords.lng},${startCoords.lat}`;
// //       const endParam = `${endCoords.lng},${endCoords.lat}`;

// //       const res = await api.get<RouteAnalyzeResponse>("/route-analyze/", {
// //         params: { start: startParam, end: endParam },
// //       });

// //       console.log("RouteAnalyze API response:", res.data);

// //       const { route, summary, blackspots_geojson, safety_score } = res.data;

// //       const r: RouteInfo = {
// //         id: "safest",
// //         geometry: route.geometry,
// //         safety_score,
// //         distance: route.distance,
// //         duration: route.duration,
// //       };

// //       setRouteInfo(r);
// //       setRouteSafety(summary);
// //       setRouteBlackspots(blackspots_geojson);
// //       setInfoMsg(
// //         `Route distance ${summary.route_distance_km} km · ${summary.total_blackspots} blackspots found`
// //       );

// //       drawRouteOnMap(r);
// //     } catch (err: any) {
// //       console.error("Route analyze failed:", err);
// //       setInfoMsg(
// //         err?.message === "Place not found"
// //           ? "Could not find one of those places. Try a more specific name."
// //           : "Failed to analyze route."
// //       );
// //     }
// //   };

// //   // ---------- Draw route ----------
// //   const drawRouteOnMap = (route: RouteInfo) => {
// //     const map = mapRef.current;
// //     if (!map) return;

// //     const sourceId = "route-safest";
// //     const layerId = "route-layer-safest";

// //     if (map.getLayer(layerId)) map.removeLayer(layerId);
// //     if (map.getSource(sourceId)) map.removeSource(sourceId);

// //     map.addSource(sourceId, {
// //       type: "geojson",
// //       data: { type: "Feature", geometry: route.geometry, properties: {} },
// //     });

// //     map.addLayer({
// //       id: layerId,
// //       type: "line",
// //       source: sourceId,
// //       layout: { "line-cap": "round", "line-join": "round" },
// //       paint: {
// //         "line-width": 5,
// //         "line-color": "#00ff00",
// //       },
// //     });

// //     const coords = route.geometry.coordinates;
// //     const bounds = new mapboxgl.LngLatBounds(
// //       coords[0] as [number, number],
// //       coords[0] as [number, number]
// //     );
// //     coords.forEach((c) => bounds.extend(c as [number, number]));
// //     map.fitBounds(bounds, { padding: 40 });
// //   };

// //   // ---------- Route-specific blackspots layer ----------
// //   useEffect(() => {
// //     const map = mapRef.current;
// //     if (!map) return;

// //     const sourceId = "route-blackspots-source";
// //     const layerId = "route-blackspots-layer";

// //     if (!routeBlackspots) {
// //       if (map.getLayer(layerId)) map.removeLayer(layerId);
// //       if (map.getSource(sourceId)) map.removeSource(sourceId);
// //       return;
// //     }

// //     if (!map.getSource(sourceId)) {
// //       map.addSource(sourceId, {
// //         type: "geojson",
// //         data: routeBlackspots,
// //       });
// //     } else {
// //       (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(
// //         routeBlackspots
// //       );
// //     }

// //     if (!map.getLayer(layerId)) {
// //       map.addLayer({
// //         id: layerId,
// //         type: "circle",
// //         source: sourceId,
// //         paint: {
// //           "circle-radius": [
// //             "interpolate",
// //             ["linear"],
// //             ["get", "severity"],
// //             1,
// //             5,
// //             3,
// //             8,
// //             5,
// //             12,
// //           ],
// //           "circle-color": [
// //             "interpolate",
// //             ["linear"],
// //             ["get", "severity"],
// //             1,
// //             "#22c55e",
// //             3,
// //             "#eab308",
// //             5,
// //             "#ef4444",
// //           ],
// //           "circle-stroke-color": "#000000",
// //           "circle-stroke-width": 1,
// //           "circle-opacity": 0.95,
// //         },
// //       });
// //     }
// //   }, [routeBlackspots]);

// //   // ---------- Incident report (right-click) ----------
// //   useEffect(() => {
// //     const map = mapRef.current;
// //     if (!map) return;

// //     const reportHandler = (e: any) => {
// //       const { lng, lat } = e.lngLat;
// //       const description = prompt("Describe incident at this location");
// //       if (!description) return;

// //       api
// //         .post("/incident/", {
// //           incident_type: "DARK_ROAD",
// //           description,
// //           latitude: lat,
// //           longitude: lng,
// //         })
// //         .then(() => window.location.reload())
// //         .catch(() => alert("Failed to report incident"));
// //     };

// //     map.on("contextmenu", reportHandler);
// //     return () => map.off("contextmenu", reportHandler);
// //   }, []);

// //   // ---------- Render ----------
// //   return (
// //     <div className="relative w-full h-full">
// //       <div ref={mapContainer} className="w-full h-full" />

// //       <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg space-y-2 w-80 border border-slate-700">
// //         <div className="flex justify-between items-center mb-1">
// //           <span className="text-sm font-semibold">Knightlee</span>
// //           <button
// //             onClick={onLogout}
// //             className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
// //           >
// //             Logout
// //           </button>
// //         </div>

// //         <div className="space-y-1 text-xs">
// //           <div>
// //             <label className="block text-slate-300">Start (place or lng,lat)</label>
// //             <input
// //               className="w-full text-black text-xs px-1 py-1 rounded"
// //               value={start}
// //               onChange={(e) => setStart(e.target.value)}
// //               placeholder="Kakkanad"
// //             />
// //           </div>
// //           <div>
// //             <label className="block text-slate-300">End (place or lng,lat)</label>
// //             <input
// //               className="w-full text-black text-xs px-1 py-1 rounded"
// //               value={end}
// //               onChange={(e) => setEnd(e.target.value)}
// //               placeholder="CUSAT"
// //             />
// //           </div>
// //         </div>

// //         <button
// //           onClick={fetchRouteAndSafety}
// //           className="mt-3 w-full text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-2 rounded"
// //         >
// //           Analyze Route
// //         </button>

// //         {infoMsg && (
// //           <div className="mt-2 text-[11px] text-slate-300">{infoMsg}</div>
// //         )}
// //       </div>

// //       {routeSafety && (
// //         <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg w-80 space-y-2 border border-slate-700">
// //           <div className="flex items-center justify-between">
// //             <span className="text-sm font-semibold">Route Safety</span>
// //             <span
// //               className={`text-lg font-bold ${
// //                 routeSafety.safety_percentage >= 80
// //                   ? "text-green-400"
// //                   : routeSafety.safety_percentage >= 50
// //                   ? "text-yellow-400"
// //                   : "text-red-400"
// //               }`}
// //             >
// //               {routeSafety.safety_percentage}%
// //             </span>
// //           </div>

// //           <div className="text-xs text-slate-300">
// //             Distance: <strong>{routeSafety.route_distance_km} km</strong>
// //           </div>

// //           <div className="text-xs text-slate-300">
// //             Blackspots on route:{" "}
// //             <strong>{routeSafety.total_blackspots}</strong> (avg severity{" "}
// //             {routeSafety.avg_severity}, max {routeSafety.max_severity})
// //           </div>

// //           {routeSafety.min_distance_km !== null && (
// //             <div className="text-xs text-slate-300">
// //               Closest blackspot to route:{" "}
// //               <strong>{routeSafety.min_distance_km} km</strong>
// //             </div>
// //           )}

// //           <div className="w-full bg-slate-700 rounded-full h-2 mt-1 overflow-hidden">
// //             <div
// //               className={`h-2 rounded-full ${
// //                 routeSafety.safety_percentage >= 80
// //                   ? "bg-green-400"
// //                   : routeSafety.safety_percentage >= 50
// //                   ? "bg-yellow-400"
// //                   : "bg-red-500"
// //               }`}
// //               style={{ width: `${routeSafety.safety_percentage}%` }}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default KnightleeMap;
// import mapboxgl from "mapbox-gl";
// import api from "../api/client";
// import React, { useEffect, useRef, useState } from "react";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg";

// interface RouteBlackspotFeature {
//   type: "Feature";
//   properties: {
//     id: number;
//     name: string;
//     severity: number;
//     distance_km: number;
//   };
//   geometry: {
//     type: "Point";
//     coordinates: [number, number];
//   };
// }

// interface RouteBlackspotGeoJSON {
//   type: "FeatureCollection";
//   features: RouteBlackspotFeature[];
// }

// interface RouteSafetySummary {
//   route_distance_km: number;
//   total_blackspots: number;
//   avg_severity: number;
//   max_severity: number;
//   min_distance_km: number | null;
//   buffer_km: number;
//   safety_percentage: number;
// }

// type RouteInfo = {
//   id: "safest";
//   geometry: GeoJSON.LineString;
//   safety_score: number;
//   distance: number;
//   duration: number;
// };

// interface RouteAnalyzeResponse {
//   route: {
//     geometry: GeoJSON.LineString;
//     distance: number; // meters
//     duration: number; // seconds
//   };
//   summary: RouteSafetySummary;
//   blackspots_geojson: RouteBlackspotGeoJSON;
//   safety_score: number;
// }

// const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
//   const mapContainer = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);

//   // User input: can be place name or "lng,lat"
//   const [start, setStart] = useState("");
//   const [end, setEnd] = useState("");

//   const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
//   const [routeSafety, setRouteSafety] = useState<RouteSafetySummary | null>(
//     null
//   );
//   const [routeBlackspots, setRouteBlackspots] =
//     useState<RouteBlackspotGeoJSON | null>(null);

//   const [infoMsg, setInfoMsg] = useState<string | null>(
//     "Enter a start and destination, then click Analyze Route."
//   );

//   // ---------- Geocode helper ----------
//   const resolveToCoords = async (value: string) => {
//     const trimmed = value.trim();
//     if (!trimmed) throw new Error("Empty value");

//     // Allow manual "lng,lat"
//     if (trimmed.includes(",")) {
//       const [lngStr, latStr] = trimmed.split(",").map((x) => x.trim());
//       const lng = Number(lngStr);
//       const lat = Number(latStr);
//       if (!isNaN(lng) && !isNaN(lat)) return { lng, lat };
//     }

//     // Treat as place name (India)
//     const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//       trimmed
//     )}.json?country=in&limit=1&autocomplete=true&access_token=${
//       mapboxgl.accessToken
//     }`;

//     const res = await fetch(url);
//     const data = await res.json();
//     console.log("Geocode result for", trimmed, data);

//     if (!data.features || data.features.length === 0) {
//       throw new Error("Place not found");
//     }

//     const [lng, lat] = data.features[0].center;
//     return { lng, lat };
//   };

//   // ---------- Init map + global heatmap / static blackspots ----------
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
//         // Incident heatmap
//         const incidentsRes = await api.get("/incidents/geojson/");
//         map.addSource("incident-points", {
//           type: "geojson",
//           data: incidentsRes.data,
//         });

//         map.addLayer({
//           id: "incident-heat",
//           type: "heatmap",
//           source: "incident-points",
//           maxzoom: 16,
//           paint: {
//             "heatmap-weight": ["+", 1, ["get", "upvotes"]],
//             "heatmap-radius": 25,
//             "heatmap-opacity": 0.8,
//           },
//         });

//         // Static blackspots
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

//         map.on("click", "blackspots-layer", (e: any) => {
//           const props = e.features[0].properties;
//           const [lng, lat] = e.features[0].geometry.coordinates;

//           new mapboxgl.Popup()
//             .setLngLat([lng, lat])
//             .setHTML(
//               `<b>${props.name}</b><br/>Severity: <strong>${props.severity}</strong>`
//             )
//             .addTo(map);
//         });

//         setInfoMsg("Heatmap + Blackspots Loaded ✔");
//       } catch (err) {
//         console.error(err);
//         setInfoMsg("❌ Error loading map data");
//       }
//     });
//   }, []);

//   // ---------- Analyze Route (your required 3 outputs) ----------
//   const fetchRouteAndSafety = async () => {
//     try {
//       if (!start.trim() || !end.trim()) {
//         setInfoMsg("Please enter both start and end.");
//         return;
//       }

//       setInfoMsg("Resolving places and analyzing route…");

//       const startCoords = await resolveToCoords(start);
//       const endCoords = await resolveToCoords(end);

//       const startParam = `${startCoords.lng},${startCoords.lat}`;
//       const endParam = `${endCoords.lng},${endCoords.lat}`;

//       const res = await api.get<RouteAnalyzeResponse>("/route-analyze/", {
//         params: { start: startParam, end: endParam },
//       });

//       console.log("RouteAnalyze API response:", res.data);

//       const { route, summary, blackspots_geojson, safety_score } = res.data;

//       const r: RouteInfo = {
//         id: "safest",
//         geometry: route.geometry,
//         safety_score,
//         distance: route.distance,
//         duration: route.duration,
//       };

//       setRouteInfo(r);
//       setRouteSafety(summary);
//       setRouteBlackspots(blackspots_geojson);
//       setInfoMsg(
//         `Distance ${summary.route_distance_km} km · ${summary.total_blackspots} blackspots`
//       );

//       drawRouteOnMap(r);
//     } catch (err: any) {
//       console.error("Route analyze failed:", err);
//       setInfoMsg(
//         err?.message === "Place not found"
//           ? "Could not find one of those places. Try a more specific name."
//           : "Failed to analyze route."
//       );
//     }
//   };

//   // ---------- Draw route on map ----------
//   const drawRouteOnMap = (route: RouteInfo) => {
//     const map = mapRef.current;
//     if (!map) return;

//     const sourceId = "route-safest";
//     const layerId = "route-layer-safest";

//     if (map.getLayer(layerId)) map.removeLayer(layerId);
//     if (map.getSource(sourceId)) map.removeSource(sourceId);

//     map.addSource(sourceId, {
//       type: "geojson",
//       data: { type: "Feature", geometry: route.geometry, properties: {} },
//     });

//     map.addLayer({
//       id: layerId,
//       type: "line",
//       source: sourceId,
//       layout: { "line-cap": "round", "line-join": "round" },
//       paint: {
//         "line-width": 5,
//         "line-color": "#00ff00",
//       },
//     });

//     const coords = route.geometry.coordinates;
//     const bounds = new mapboxgl.LngLatBounds(
//       coords[0] as [number, number],
//       coords[0] as [number, number]
//     );
//     coords.forEach((c) => bounds.extend(c as [number, number]));
//     map.fitBounds(bounds, { padding: 40 });
//   };

//   // ---------- Route-specific blackspots layer ----------
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     const sourceId = "route-blackspots-source";
//     const layerId = "route-blackspots-layer";

//     if (!routeBlackspots) {
//       if (map.getLayer(layerId)) map.removeLayer(layerId);
//       if (map.getSource(sourceId)) map.removeSource(sourceId);
//       return;
//     }

//     if (!map.getSource(sourceId)) {
//       map.addSource(sourceId, {
//         type: "geojson",
//         data: routeBlackspots,
//       });
//     } else {
//       (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(
//         routeBlackspots
//       );
//     }

//     if (!map.getLayer(layerId)) {
//       map.addLayer({
//         id: layerId,
//         type: "circle",
//         source: sourceId,
//         paint: {
//           "circle-radius": [
//             "interpolate",
//             ["linear"],
//             ["get", "severity"],
//             1,
//             5,
//             3,
//             8,
//             5,
//             12,
//           ],
//           "circle-color": [
//             "interpolate",
//             ["linear"],
//             ["get", "severity"],
//             1,
//             "#22c55e",
//             3,
//             "#eab308",
//             5,
//             "#ef4444",
//           ],
//           "circle-stroke-color": "#000000",
//           "circle-stroke-width": 1,
//           "circle-opacity": 0.95,
//         },
//       });
//     }
//   }, [routeBlackspots]);

//   // ---------- Incident report (right-click) ----------
//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     const reportHandler = (e: any) => {
//       const { lng, lat } = e.lngLat;
//       const description = prompt("Describe incident at this location");
//       if (!description) return;

//       api
//         .post("/incident/", {
//           incident_type: "DARK_ROAD",
//           description,
//           latitude: lat,
//           longitude: lng,
//         })
//         .then(() => window.location.reload())
//         .catch(() => alert("Failed to report incident"));
//     };

//     map.on("contextmenu", reportHandler);
//     return () => map.off("contextmenu", reportHandler);
//   }, []);

//   // ---------- Render ----------
//   return (
//     <div className="relative w-full h-full">
//       <div ref={mapContainer} className="w-full h-full" />

//       {/* Top control panel */}
//       <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg space-y-2 w-80 border border-slate-700">
//         <div className="flex justify-between items-center mb-1">
//           <span className="text-sm font-semibold">Knightlee</span>
//           <button
//             onClick={onLogout}
//             className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
//           >
//             Logout
//           </button>
//         </div>

//         <div className="space-y-1 text-xs">
//           <div>
//             <label className="block text-slate-300">
//               Start (place or lng,lat)
//             </label>
//             <input
//               className="w-full text-black text-xs px-1 py-1 rounded"
//               value={start}
//               onChange={(e) => setStart(e.target.value)}
//               placeholder="e.g. Kakkanad"
//             />
//           </div>
//           <div>
//             <label className="block text-slate-300">
//               End (place or lng,lat)
//             </label>
//             <input
//               className="w-full text-black text-xs px-1 py-1 rounded"
//               value={end}
//               onChange={(e) => setEnd(e.target.value)}
//               placeholder="e.g. CUSAT"
//             />
//           </div>
//         </div>

//         <button
//           onClick={fetchRouteAndSafety}
//           className="mt-3 w-full text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-2 rounded"
//         >
//           Analyze Route
//         </button>

//         {infoMsg && (
//           <div className="mt-2 text-[11px] text-slate-300">{infoMsg}</div>
//         )}
//       </div>

//       {/* Bottom card: EXACTLY what you asked for */}
//       {routeSafety && (
//         <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg w-80 space-y-2 border border-slate-700">
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-semibold">Route Safety</span>
//             <span
//               className={`text-lg font-bold ${
//                 routeSafety.safety_percentage >= 80
//                   ? "text-green-400"
//                   : routeSafety.safety_percentage >= 50
//                   ? "text-yellow-400"
//                   : "text-red-400"
//               }`}
//             >
//               {routeSafety.safety_percentage}%
//             </span>
//           </div>

//           <div className="text-xs text-slate-300">
//             Distance:{" "}
//             <strong>{routeSafety.route_distance_km.toFixed(1)} km</strong>
//           </div>

//           <div className="text-xs text-slate-300">
//             Blackspots on route:{" "}
//             <strong>{routeSafety.total_blackspots}</strong>
//           </div>

//           <div className="w-full bg-slate-700 rounded-full h-2 mt-1 overflow-hidden">
//             <div
//               className={`h-2 rounded-full ${
//                 routeSafety.safety_percentage >= 80
//                   ? "bg-green-400"
//                   : routeSafety.safety_percentage >= 50
//                   ? "bg-yellow-400"
//                   : "bg-red-500"
//               }`}
//               style={{ width: `${routeSafety.safety_percentage}%` }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default KnightleeMap;
import mapboxgl from "mapbox-gl";
import api from "../api/client";
import React, { useEffect, useRef, useState } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWJoaWFiaGluYW5kYW5hMDkiLCJhIjoiY21pc3E3Y3ZrMDB0NTNmc2J6Z2RhZXI4NyJ9.nsB4sflxG_e3KK2DYWwpqg";

interface BackendRouteAnalyze {
  distance_km: number;
  safety_score: number;
  blackspots_detected: boolean;
  message: string;
  start: string;
  end: string;
}

const KnightleeMap: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [start, setStart] = useState(""); // place or lng,lat
  const [end, setEnd] = useState("");

  const [analysis, setAnalysis] = useState<BackendRouteAnalyze | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(
    "Enter start & destination, then click Analyze Route."
  );
  const [loading, setLoading] = useState(false);

  // ---------- Geocode helper ----------
  const resolveToCoords = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) throw new Error("Empty value");

    // allow manual lng,lat
    if (trimmed.includes(",")) {
      const [lngStr, latStr] = trimmed.split(",").map((x) => x.trim());
      const lng = Number(lngStr);
      const lat = Number(latStr);
      if (!isNaN(lng) && !isNaN(lat)) return { lng, lat };
    }

    // treat as place name inside India
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      trimmed
    )}.json?country=in&limit=1&autocomplete=true&access_token=${
      mapboxgl.accessToken
    }`;

    const res = await fetch(url);
    const data = await res.json();
    console.log("Geocode result for", trimmed, data);

    if (!data.features || data.features.length === 0) {
      throw new Error("Place not found");
    }

    const [lng, lat] = data.features[0].center;
    return { lng, lat };
  };

  // ---------- Init map + static layers ----------
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
        // Incident heatmap
        const incidentsRes = await api.get("/incidents/geojson/");
        map.addSource("incident-points", {
          type: "geojson",
          data: incidentsRes.data,
        });

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

        // Static blackspots
        const blackspotsRes = await api.get("/blackspots/geojson/");
        map.addSource("blackspots", {
          type: "geojson",
          data: blackspotsRes.data,
        });

        map.addLayer({
          id: "blackspots-layer",
          type: "circle",
          source: "blackspots",
          paint: {
            "circle-color": [
              "case",
              [">=", ["get", "severity"], 4],
              "#ff0000",
              ["==", ["get", "severity"], 3],
              "#ff8800",
              "#00cc44",
            ],
            "circle-radius": 8,
            "circle-opacity": 0.9,
          },
        });

        map.on("click", "blackspots-layer", (e: any) => {
          const props = e.features[0].properties;
          const [lng, lat] = e.features[0].geometry.coordinates;

          new mapboxgl.Popup()
            .setLngLat([lng, lat])
            .setHTML(
              `<b>${props.name}</b><br/>Severity: <strong>${props.severity}</strong>`
            )
            .addTo(map);
        });

        setInfoMsg("Heatmap + Blackspots Loaded ✔");
      } catch (err) {
        console.error(err);
        setInfoMsg("❌ Error loading map data");
      }
    });
  }, []);

  // ---------- Call /route-analyze/ and show as card ----------
  const fetchRouteAndSafety = async () => {
    try {
      if (!start.trim() || !end.trim()) {
        setInfoMsg("Please enter both start and end.");
        return;
      }

      setLoading(true);
      setAnalysis(null);
      setInfoMsg("Resolving places and analyzing route…");

      const startCoords = await resolveToCoords(start);
      const endCoords = await resolveToCoords(end);

      const startParam = `${startCoords.lng},${startCoords.lat}`;
      const endParam = `${endCoords.lng},${endCoords.lat}`;

      const res = await api.get<BackendRouteAnalyze>("/route-analyze/", {
        params: { start: startParam, end: endParam },
      });

      console.log("Route-analyze response:", res.data);
      setAnalysis(res.data);
      setInfoMsg(res.data.message || "Route analyzed.");
    } catch (err: any) {
      console.error("Route analyze failed:", err);
      setAnalysis(null);
      setInfoMsg(
        err?.message === "Place not found"
          ? "Could not find one of those places. Try a more specific name."
          : "Failed to analyze route."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- Small helper for label ----------
  const safetyLabel = (score: number) => {
    if (score >= 85) return "Very Safe";
    if (score >= 60) return "Moderate";
    return "Risky";
  };

  // ---------- Render ----------
  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top controls */}
      <div className="absolute top-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg space-y-2 w-80 border border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">Knightlee</span>
          <button
            onClick={onLogout}
            className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
          >
            Logout
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <div>
            <label className="block text-slate-300">
              Start (place or lng,lat)
            </label>
            <input
              className="w-full text-black text-xs px-1 py-1 rounded"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="e.g. Alappuzha or 76.3,9.5"
            />
          </div>
          <div>
            <label className="block text-slate-300">
              End (place or lng,lat)
            </label>
            <input
              className="w-full text-black text-xs px-1 py-1 rounded"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="e.g. Kannur or 75.3,11.8"
            />
          </div>
        </div>

        <button
          onClick={fetchRouteAndSafety}
          className="mt-3 w-full text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Analyzing…" : "Analyze Route"}
        </button>

        {infoMsg && (
          <div className="mt-2 text-[11px] text-slate-300">{infoMsg}</div>
        )}
      </div>

      {/* Bottom card – like your design */}
      {analysis && (
        <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white px-4 py-3 rounded-xl shadow-lg w-80 space-y-2 border border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold">Route Analysis</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                analysis.safety_score >= 85
                  ? "bg-green-500/20 text-green-300"
                  : analysis.safety_score >= 60
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {safetyLabel(analysis.safety_score)} · {analysis.safety_score}
            </span>
          </div>

          <div className="text-xs text-slate-300">
            Distance: <strong>{analysis.distance_km.toFixed(1)} km</strong>
          </div>

          <div className="text-xs text-slate-300">
            Blackspots:{" "}
            {analysis.blackspots_detected ? (
              <span className="text-red-400 font-semibold">Detected ⚠️</span>
            ) : (
              <span className="text-green-400 font-semibold">None ✅</span>
            )}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            <div>
              Start:&nbsp;
              <span className="font-mono">{analysis.start}</span>
            </div>
            <div>
              End:&nbsp;
              <span className="font-mono">{analysis.end}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnightleeMap;

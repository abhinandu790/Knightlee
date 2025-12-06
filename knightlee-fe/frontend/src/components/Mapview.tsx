import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const MapView = () => {
  useEffect(() => {
    const map = L.map("map").setView([10.8505, 76.2711], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Default marker fix
    const DefaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    // Fetch blackspots from backend
    fetch("http://127.0.0.1:8000/api/blackspots/geojson/")
      .then((res) => res.json())
      .then((data) => {
        L.geoJSON(data, {
          pointToLayer: (feature: any, latlng) => {
            const severity = feature.properties.severity;

            return L.circleMarker(latlng, {
              radius: 8,
              fillColor:
                severity >= 4 ? "red" : severity === 3 ? "orange" : "green",
              color: "#000",
              weight: 1,
              fillOpacity: 0.9,
            }).bindPopup(`
              <b>${feature.properties.name}</b><br/>
              Severity: ${severity}
            `);
          },
        }).addTo(map);
      });
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export d

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function RealTimeMap() {
  const devices = [
    { id: 1, position: [4.8156, 7.0498], name: "Unit 001" },
    { id: 2, position: [4.8256, 7.0598], name: "Unit 002" },
    { id: 3, position: [4.8056, 7.0398], name: "Unit 003" },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: "15px" }}>Real Time Tracking</h2>

      <div className="map-container">
        <MapContainer
          center={[4.8156, 7.0498]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {devices.map((device) => (
            <Marker key={device.id} position={device.position}>
              <Popup>
                🚓 {device.name} <br />
                Status: Active
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default RealTimeMap;
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./RealTimeMap.css"; // Ensure you created this file

// 1. Custom Light Brown Pulsing Icon for Live Units
const createLiveIcon = () => L.divIcon({
  className: "custom-pulsing-marker",
  html: `<div class="pulse-ring"></div><div class="pulse-dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// 2. Grey Icon for Offline/Inactive Units
const offlineIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function RealTimeMap() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
  const API_URL = `${API_BASE}/api/device`;

  // Default Map Center (Updates when devices are found)
  const defaultCenter = [4.8156, 7.0498];

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (res.ok) {
          setDevices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Map Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
    // Real-time polling: Refresh map every 5 seconds
    const interval = setInterval(fetchMapData, 5000);
    return () => clearInterval(interval);
  }, [API_URL]);

  if (loading) return <div className="map-loading">Loading Tactical Map...</div>;

  return (
    <div className="map-wrapper">
      <div className="map-header">
        <h2 style={{ color: "#c2a078", marginBottom: "5px" }}>Real Time Tracking</h2>
        <p style={{ color: "#888", fontSize: "12px", marginBottom: "15px" }}>
          Active units pulsing in <span style={{ color: "#c2a078" }}>Light Brown</span>
        </p>
      </div>

      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "550px", width: "100%", background: "#1a1a1a" }}
        >
          {/* Using a Dark Mode TileLayer for a professional VMS look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {devices.map((device) => {
            // Check if device is linked to a slot in LiveVideo
            const isLive = device.slot !== null && device.slot !== undefined;
            
            // Ensure we have coordinates, otherwise fallback to default
            const position = [
              device.lat || (defaultCenter[0] + (Math.random() - 0.5) * 0.01), 
              device.lng || (defaultCenter[1] + (Math.random() - 0.5) * 0.01)
            ];

            return (
              <Marker 
                key={device._id} 
                position={position}
                icon={isLive ? createLiveIcon() : offlineIcon}
              >
                <Popup className="vms-map-popup">
                  <div className="popup-content">
                    <strong>{device.deviceName}</strong>
                    <div className="popup-info">
                      <span>Status: <span style={{ color: device.status === 'Online' ? '#00ff00' : '#ff4444' }}>{device.status}</span></span>
                      <br />
                      <span>ID: {device.deviceId}</span>
                      {isLive && (
                        <div className="live-badge">
                          <span className="live-dot"></span> IN LIVE FEED (Slot {device.slot})
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
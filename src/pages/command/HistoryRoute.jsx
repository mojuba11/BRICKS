import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { FaSearch, FaPlay, FaPause, FaUndo, FaMapMarkerAlt } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./HistoryRoute.css";

// Custom Icon for the moving unit
const movingUnitIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function HistoryRoute() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [routeData, setRouteData] = useState([]); // Array of [lat, lng]

  // Mock Data Trigger (In a real app, this comes from your Query)
  const handleQuery = () => {
    const mockRoute = [
      [4.8156, 7.0498], [4.8160, 7.0510], [4.8175, 7.0525], 
      [4.8190, 7.0540], [4.8210, 7.0560], [4.8230, 7.0585]
    ];
    setRouteData(mockRoute);
    setProgress(0);
  };

  // Playback Logic
  useEffect(() => {
    let interval = null;
    if (isPlaying && progress < routeData.length - 1) {
      interval = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 800); // Speed of playback
    } else {
      setIsPlaying(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, routeData]);

  return (
    <div className="history-page-container">
      <div className="history-tabs">
        <div className="tab active"><FaMapMarkerAlt style={{marginRight: '8px'}} /> Historical route ×</div>
      </div>

      <div className="history-layout">
        <div className="history-sidebar">
          <div className="sidebar-header">Route Query</div>
          <div className="sidebar-section">
            <label>Device ID</label>
            <input type="text" placeholder="e.g. DEV-001" className="history-input" />
          </div>
          <div className="sidebar-section">
            <label>Start/End Time</label>
            <input type="datetime-local" className="history-input" style={{marginBottom: '5px'}} />
            <input type="datetime-local" className="history-input" />
          </div>

          <button className="history-query-btn" onClick={handleQuery}>
            <FaSearch /> Query Route
          </button>

          <div className="playback-box">
            <div className="playback-btns">
              <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn play" disabled={routeData.length === 0}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-btn" onClick={() => {setProgress(0); setIsPlaying(false);}}>
                <FaUndo />
              </button>
            </div>

            <div className="slider-container">
              <input 
                type="range" 
                min="0" 
                max={routeData.length > 0 ? routeData.length - 1 : 0} 
                className="playback-slider" 
                value={progress} 
                onChange={(e) => setProgress(parseInt(e.target.value))} 
              />
            </div>
          </div>
        </div>

        <div className="history-map-area">
          <MapContainer center={[4.8156, 7.0498]} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            
            {routeData.length > 0 && (
              <>
                {/* The Breadcrumb Trail */}
                <Polyline positions={routeData} color="#c2a078" weight={4} opacity={0.6} dashArray="10, 10" />
                
                {/* The Moving Unit */}
                <Marker position={routeData[progress]} icon={movingUnitIcon} />
              </>
            )}

            {routeData.length === 0 && (
              <div className="map-overlay-info">Query a device to see history</div>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
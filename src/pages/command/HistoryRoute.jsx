import React, { useState } from "react";
import { FaSearch, FaPlay, FaPause, FaHistory } from "react-icons/fa";
import "./HistoryRoute.css";

export default function HistoryRoute() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="history-page-container">
      {/* HEADER TAB */}
      <div className="history-tabs">
        <div className="tab active">Historical route ×</div>
      </div>

      <div className="history-layout">
        {/* LEFT CONTROL PANEL */}
        <div className="history-sidebar">
          <div className="sidebar-section">
            <label>Device ID</label>
            <input type="text" placeholder="Enter Device ID" className="history-input" />
          </div>

          <div className="sidebar-section">
            <label>Start Time</label>
            <input type="datetime-local" className="history-input" />
          </div>

          <div className="sidebar-section">
            <label>End Time</label>
            <input type="datetime-local" className="history-input" />
          </div>

          <button className="history-query-btn">
            <FaSearch /> Query Route
          </button>

          <hr className="divider" />

          {/* PLAYBACK CONTROLS */}
          <div className="playback-box">
            <span>Playback Control</span>
            <div className="playback-btns">
              <button onClick={() => setIsPlaying(!isPlaying)} className="control-btn">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-btn"><FaHistory /></button>
            </div>
            <input type="range" className="playback-slider" />
          </div>
        </div>

        {/* MAP DISPLAY AREA */}
        <div className="history-map-area">
          <div className="map-placeholder">
            <div className="map-overlay-info">
              No route data selected. Please use the sidebar to query.
            </div>
            {/* Map Engine (Leaflet/Google) goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
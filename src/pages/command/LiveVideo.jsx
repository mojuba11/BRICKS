import React, { useState, useEffect } from "react";
import { FaExpand, FaPlus, FaVideo, FaTimes } from "react-icons/fa";
import "./LiveVideo.css";

export default function LiveVideo() {
  const [gridSize, setGridSize] = useState(16);
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newDevice, setNewDevice] = useState({ name: "", url: "" });

  const API_URL = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/devices`);
      const data = await res.json();
      if (res.ok) setDevices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAddClick = (slotId) => {
    setSelectedSlot(slotId);
    setIsModalOpen(true);
  };

  const saveDevice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDevice, slot: selectedSlot }),
      });
      if (res.ok) {
        fetchDevices();
        setIsModalOpen(false);
        setNewDevice({ name: "", url: "" });
      }
    } catch (err) {
      alert("Error saving device");
    }
  };

  const getDeviceInSlot = (slotId) => devices.find((d) => d.slot === slotId);

  return (
    <div className="vms-main-wrapper">
      {/* 1. SIDEBAR CONTROLS */}
      <div className="vms-controls">
        {[1, 4, 9, 16].map((num) => (
          <button 
            key={num} 
            onClick={() => setGridSize(num)} 
            className={gridSize === num ? "active" : ""}
          >
            {num}
          </button>
        ))}
        <button className="expand-btn"><FaExpand size={12} /></button>
      </div>

      {/* 2. VIDEO GRID */}
      <div className={`vms-grid-container grid-size-${gridSize}`}>
        {Array.from({ length: gridSize }, (_, i) => i + 1).map((slotId) => {
          const device = getDeviceInSlot(slotId);
          return (
            <div key={slotId} className="vms-card">
              {device ? (
                <div className="vms-video-placeholder">
                  <div className="video-header">
                    <span>{device.name}</span>
                    <FaVideo color="#00ff00" />
                  </div>
                  <div className="video-content"><p>LIVE STREAM</p></div>
                </div>
              ) : (
                <button className="top-right-add-btn" onClick={() => handleAddClick(slotId)}>
                  <FaPlus size={10} /> <span>Add Device</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. THE POPUP MODAL (Must be outside the grid container) */}
      {isModalOpen && (
        <div className="vms-popup-overlay">
          <div className="vms-popup-box">
            <div className="vms-popup-header">
              <h3>Add Device to Slot {selectedSlot}</h3>
              <FaTimes className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            <form onSubmit={saveDevice} className="vms-popup-form">
              <label>Device Name</label>
              <input 
                type="text" 
                value={newDevice.name}
                onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                placeholder="e.g. BodyCam North"
                required 
              />
              <label>RTSP/Stream URL</label>
              <input 
                type="text" 
                value={newDevice.url}
                onChange={(e) => setNewDevice({...newDevice, url: e.target.value})}
                placeholder="rtsp://192.168..."
                required 
              />
              <div className="vms-popup-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
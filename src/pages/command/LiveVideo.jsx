import React, { useState, useEffect } from "react";
import { FaExpand, FaPlus, FaVideo, FaTimes, FaTrash, FaCircle, FaLink } from "react-icons/fa";
import "./LiveVideo.css";

export default function LiveVideo() {
  const [gridSize, setGridSize] = useState(16);
  const [slots, setSlots] = useState([]); 
  const [allDevices, setAllDevices] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
  const API_URL = `${API_BASE}/api/device`; 

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) {
        const devices = Array.isArray(data) ? data : [];
        setAllDevices(devices);
        // Sync the grid slots with the database
        setSlots(devices.filter(d => d.slot !== undefined && d.slot !== null));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAttachCamera = async (device) => {
    // Prevent attaching offline cameras
    if (device.status !== "Online") return;

    try {
      const res = await fetch(`${API_URL}/${device._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: selectedSlot })
      });

      if (res.ok) {
        fetchDevices();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert("Error linking camera to slot");
    }
  };

  const handleDetachCamera = async (device) => {
    try {
      await fetch(`${API_URL}/${device._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: null })
      });
      fetchDevices();
    } catch (err) {
      console.error("Detach error:", err);
    }
  };

  const getDeviceInSlot = (slotId) => slots.find((s) => Number(s.slot) === Number(slotId));

  return (
    <div className="vms-main-wrapper">
      <div className="vms-controls">
        {[1, 4, 9, 16].map((num) => (
          <button key={num} onClick={() => setGridSize(num)} className={gridSize === num ? "active" : ""}>
            {num}
          </button>
        ))}
        <button className="expand-btn"><FaExpand size={12} /></button>
      </div>

      <div className={`vms-grid-container grid-size-${gridSize}`}>
        {Array.from({ length: gridSize }, (_, i) => i + 1).map((slotId) => {
          const device = getDeviceInSlot(slotId);
          return (
            <div key={slotId} className="vms-card">
              {device ? (
                <div className="vms-video-container">
                  <div className="video-header">
                    <div className="header-left">
                      <span className="rec-dot"><FaCircle size={8} /> LIVE</span>
                      <span>{device.deviceName}</span>
                    </div>
                    <FaTrash className="delete-icon" onClick={() => handleDetachCamera(device)} title="Unlink Camera" />
                  </div>
                  <div className="video-content">
                    <video src={device.streamUrl} autoPlay muted loop className="live-video-player" />
                  </div>
                  <div className="video-footer">
                    <span className={`status-indicator ${device.status.toLowerCase()}`}></span>
                    {device.status} • {device.deviceSerial}
                  </div>
                </div>
              ) : (
                <button className="top-right-add-btn" onClick={() => { setSelectedSlot(slotId); setIsModalOpen(true); }}>
                  <FaPlus size={10} /> <span>Link Camera</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="vms-popup-overlay">
          <div className="vms-popup-box">
            <div className="vms-popup-header">
              <h3>Select Camera (Slot {selectedSlot})</h3>
              <FaTimes className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <div className="camera-list">
              {allDevices
                .filter(d => !d.slot) 
                .sort((a, b) => (a.status === 'Online' ? -1 : 1))
                .map(device => {
                  const isOnline = device.status === "Online";
                  return (
                    <div 
                      key={device._id} 
                      className={`camera-item ${!isOnline ? 'offline-item' : ''}`} 
                      onClick={() => handleAttachCamera(device)}
                    >
                      <div className="cam-info">
                        <FaVideo color={isOnline ? "#00ff00" : "#ff4444"} />
                        <div>
                          <strong>{device.deviceName}</strong>
                          <span>{device.deviceSerial}</span>
                        </div>
                      </div>
                      <div className="item-action">
                        {isOnline ? <FaLink className="link-icon" /> : <span className="offline-tag">OFFLINE</span>}
                      </div>
                    </div>
                  );
                })}
              {allDevices.filter(d => !d.slot).length === 0 && (
                <p className="no-cameras">No available cameras found in database.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
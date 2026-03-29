import React, { useState, useEffect } from "react";
import { FaExpand, FaPlus, FaVideo, FaTimes, FaTrash, FaCircle, FaLink } from "react-icons/fa";
import "./LiveVideo.css";

export default function LiveVideo() {
  const [gridSize, setGridSize] = useState(16);
  const [slots, setSlots] = useState([]); // This stores which camera is in which grid slot
  const [allDevices, setAllDevices] = useState([]); // All devices from your DB
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
        setAllDevices(Array.isArray(data) ? data : []);
        // Only load devices that have a 'slot' assigned into the active grid
        setSlots(data.filter(d => d.slot !== undefined));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAttachCamera = async (device) => {
    try {
      // Update the device in the DB to assign it to this specific grid slot
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
      // Remove the slot assignment from the DB
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

  const getDeviceInSlot = (slotId) => slots.find((s) => s.slot === slotId);

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
                    <FaTrash className="delete-icon" onClick={() => handleDetachCamera(device)} />
                  </div>
                  <div className="video-content">
                    <video src={device.streamUrl} autoPlay muted className="live-video-player" />
                  </div>
                  <div className="video-footer">
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

      {/* SELECTION MODAL */}
      {isModalOpen && (
        <div className="vms-popup-overlay">
          <div className="vms-popup-box">
            <div className="vms-popup-header">
              <h3>Select Online Camera (Slot {selectedSlot})</h3>
              <FaTimes className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <div className="camera-list">
              {allDevices
                .filter(d => !d.slot) // Only show cameras not already in the grid
                .map(device => (
                  <div key={device._id} className="camera-item" onClick={() => handleAttachCamera(device)}>
                    <div className="cam-info">
                      <FaVideo color={device.status === "Online" ? "#00ff00" : "#666"} />
                      <strong>{device.deviceName}</strong>
                      <span>{device.deviceSerial}</span>
                    </div>
                    <FaLink className="link-icon" />
                  </div>
                ))}
              {allDevices.filter(d => !d.slot).length === 0 && <p>No unassigned cameras found.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
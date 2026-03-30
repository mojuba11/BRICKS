import React, { useState, useEffect } from "react";
import { FaPlus, FaVideo, FaTimes, FaTrash, FaCircle, FaSync } from "react-icons/fa";
import "./LiveVideo.css";

export default function LiveVideo() {
  const [gridSize, setGridSize] = useState(16);
  const [allDevices, setAllDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
  const API_URL = `${API_BASE}/api/device`;

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000); // Faster sync for live status
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) setAllDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttachCamera = async (device) => {
    if (device.status !== "Online") {
      alert("This camera is currently offline.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${device._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: selectedSlot.toString() }), // Store slot as string
      });

      if (res.ok) {
        fetchDevices();
        setIsModalOpen(false);
      }
    } catch (err) {
      alert("Error linking camera");
    }
  };

  const handleDetachCamera = async (device) => {
    try {
      await fetch(`${API_URL}/${device._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: null }),
      });
      fetchDevices();
    } catch (err) {
      console.error("Detach error:", err);
    }
  };

  const getDeviceInSlot = (slotId) =>
    allDevices.find((d) => d.slot && Number(d.slot) === Number(slotId));

  const renderStream = (device) => {
    const url = device.streamUrl;
    if (!url) return <div className="no-stream-msg">No Stream URL</div>;

    // Handle RTSP.me or other embeds
    if (url.includes("rtsp.me") || url.includes("embed")) {
      return (
        <iframe
          src={url}
          className="live-video-player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={device.deviceName}
        />
      );
    }

    // Default to Image/MJPEG for DroidCam local testing or standard video
    return (
      <img
        src={url}
        className="live-video-player"
        alt="Live Stream"
        onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Offline"; }}
      />
    );
  };

  return (
    <div className="vms-main-wrapper">
      <div className="vms-controls">
        {[1, 4, 9, 16].map((num) => (
          <button key={num} onClick={() => setGridSize(num)} className={gridSize === num ? "active" : ""}>
            {num}
          </button>
        ))}
        <button className="refresh-btn" onClick={fetchDevices} disabled={loading}>
          <FaSync className={loading ? "spinning" : ""} />
        </button>
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
                      <span className="device-name-text">{device.deviceName}</span>
                    </div>
                    <FaTrash className="delete-icon" onClick={() => handleDetachCamera(device)} />
                  </div>
                  
                  <div className="video-content">
                    {renderStream(device)}
                  </div>

                  <div className="video-footer">
                    <span className={`status-indicator ${device.status.toLowerCase()}`}></span>
                    {device.status} • {device.deviceId}
                  </div>
                </div>
              ) : (
                <button className="add-slot-placeholder" onClick={() => { setSelectedSlot(slotId); setIsModalOpen(true); }}>
                  <FaPlus size={24} />
                  <span>Link {slotId}</span>
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
              <h3>Link Camera to Slot {selectedSlot}</h3>
              <FaTimes className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="camera-list">
              {allDevices
                .filter((d) => !d.slot)
                .map((device) => (
                  <div key={device._id} className={`camera-item ${device.status !== "Online" ? "offline-item" : ""}`} onClick={() => handleAttachCamera(device)}>
                    <FaVideo />
                    <div className="cam-details">
                      <strong>{device.deviceName}</strong>
                      <small>{device.deviceId} - {device.status}</small>
                    </div>
                  </div>
                ))}
              {allDevices.filter((d) => !d.slot).length === 0 && <p style={{textAlign:'center', padding: '20px'}}>No available cameras.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
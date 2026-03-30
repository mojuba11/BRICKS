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
    const interval = setInterval(fetchDevices, 15000);
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
    try {
      const res = await fetch(`${API_URL}/${device._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: String(selectedSlot) }),
      });

      if (res.ok) {
        await fetchDevices();
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
    allDevices.find((d) => d.slot !== null && d.slot !== undefined && Number(d.slot) === Number(slotId));

  // --- UPDATED RENDER LOGIC ---
  const renderStream = (device) => {
    const url = device.streamUrl;
    const serverType = device.videoServer;

    if (!url) return <div className="no-stream">No Stream URL</div>;

    // 1. Handle Cloud/Embed Servers (RTSP.me, YouTube, Wowza)
    if (
      serverType === "RTSP.me" || 
      serverType === "YouTube" || 
      serverType === "Wowza" ||
      url.includes("embed")
    ) {
      return (
        <iframe
          key={device._id}
          src={url}
          className="live-video-player"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={device.deviceName}
        />
      );
    }

    // 2. Handle Local MJPEG Servers (DroidCam)
    if (serverType === "DroidCam" || serverType === "Generic") {
      return (
        <img
          key={device._id}
          src={url}
          className="live-video-player"
          alt="Live Stream"
          // This allows the browser to request the image from a different origin (your phone IP)
          crossOrigin="anonymous" 
          style={{ 
            objectFit: 'cover', 
            backgroundColor: '#000', 
            width: '100%', 
            height: '100%',
            display: 'block' 
          }}
          onError={(e) => { 
            console.error("Stream Error for:", device.deviceName);
            e.target.src = "https://via.placeholder.com/400x300?text=Camera+Offline"; 
          }}
        />
      );
    }

    // Default Fallback
    return <div className="no-stream">Unsupported Config</div>;
  };

  return (
    <div className="vms-main-wrapper">
      <div className="vms-sidebar">
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
                      <FaCircle className="rec-dot" size={8} /> <span>{device.deviceName}</span>
                    </div>
                    <FaTrash className="delete-icon" onClick={() => handleDetachCamera(device)} />
                  </div>
                  <div className="video-content">
                    {renderStream(device)}
                  </div>
                  <div className="video-footer">
                    {device.deviceState} • {device.videoServer}
                  </div>
                </div>
              ) : (
                <button className="add-slot-placeholder" onClick={() => { setSelectedSlot(slotId); setIsModalOpen(true); }}>
                  <FaPlus size={20} />
                  <span>Slot {slotId}</span>
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
              <FaTimes onClick={() => setIsModalOpen(false)} style={{cursor:'pointer'}} />
            </div>
            <div className="camera-list">
              {allDevices.filter(d => !d.slot).map(device => (
                <div key={device._id} className="camera-item" onClick={() => handleAttachCamera(device)}>
                  <FaVideo />
                  <div>
                    <strong>{device.deviceName}</strong>
                    <p style={{margin:0, fontSize:'12px'}}>{device.videoServer}</p>
                  </div>
                </div>
              ))}
              {allDevices.filter(d => !d.slot).length === 0 && (
                <p style={{color:'#666', textAlign:'center', padding:'20px'}}>All cameras are already linked.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
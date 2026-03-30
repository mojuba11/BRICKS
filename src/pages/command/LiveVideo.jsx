import React, { useState, useEffect } from "react";
import {
  FaPlus, FaVideo, FaTimes, FaTrash,
  FaCircle, FaLink, FaSync
} from "react-icons/fa";
import "./LiveVideo.css";

export default function LiveVideo() {
  const [gridSize, setGridSize] = useState(16);
  const [allDevices, setAllDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://bricks-backend-7wnv.onrender.com";

  const API_URL = `${API_BASE}/api/device`;

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 30000);
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
    if (device.status !== "Online") return;

    try {
      await fetch(`${API_URL}/${device._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: selectedSlot }),
      });

      fetchDevices();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error linking camera to slot");
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
    allDevices.find((d) => Number(d.slot) === Number(slotId));

  // ✅ STREAM RENDERER (FIXED CORE)
  const renderStream = (device) => {
    const url = device.streamUrl;

    if (!url) return <div>No stream</div>;

    // RTSP or iframe-based streams (future CCTV systems)
    if (url.startsWith("rtsp") || url.includes("rtsp.me")) {
      return (
        <iframe
          src={url}
          className="live-video-player"
          allowFullScreen
        />
      );
    }

    // MJPEG streams (DroidCam / IP Webcam / your current setup)
    return (
      <img
        src={url}
        className="live-video-player"
        alt="live stream"
        onError={(e) => {
          e.target.src = "/offline.png";
        }}
      />
    );
  };

  return (
    <div className="vms-main-wrapper">

      {/* HEADER */}
      <div className="vms-header">
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

          <button
            className="refresh-btn"
            onClick={fetchDevices}
            disabled={loading}
          >
            <FaSync className={loading ? "spinning" : ""} />
          </button>
        </div>

        <div className="vms-stats">
          Online: {allDevices.filter(d => d.status === "Online").length} / {allDevices.length}
        </div>
      </div>

      {/* GRID */}
      <div className={`vms-grid-container grid-size-${gridSize}`}>
        {Array.from({ length: gridSize }, (_, i) => i + 1).map((slotId) => {
          const device = getDeviceInSlot(slotId);

          return (
            <div key={slotId} className="vms-card">

              {device ? (
                <div className="vms-video-container">

                  {/* HEADER */}
                  <div className="video-header">
                    <div className="header-left">
                      <span className="rec-dot">
                        <FaCircle size={8} /> LIVE
                      </span>
                      <span className="device-name-text">
                        {device.deviceName}
                      </span>
                    </div>

                    <FaTrash
                      className="delete-icon"
                      onClick={() => handleDetachCamera(device)}
                    />
                  </div>

                  {/* STREAM */}
                  <div className="video-content">
                    {renderStream(device)}
                  </div>

                  {/* FOOTER */}
                  <div className="video-footer">
                    <span
                      className={`status-indicator ${device.status.toLowerCase()}`}
                    ></span>
                    {device.status} • {device.deviceId}
                  </div>

                </div>
              ) : (
                <button
                  className="add-slot-placeholder"
                  onClick={() => {
                    setSelectedSlot(slotId);
                    setIsModalOpen(true);
                  }}
                >
                  <FaPlus size={20} />
                  <span>Link Camera</span>
                </button>
              )}

            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="vms-popup-overlay">
          <div className="vms-popup-box">

            <div className="vms-popup-header">
              <h3>Select Camera for Slot {selectedSlot}</h3>
              <FaTimes onClick={() => setIsModalOpen(false)} />
            </div>

            <div className="camera-list">
              {allDevices
                .filter(d => !d.slot)
                .map(device => (
                  <div
                    key={device._id}
                    className="camera-item"
                    onClick={() => handleAttachCamera(device)}
                  >
                    <FaVideo />
                    <div>
                      <strong>{device.deviceName}</strong>
                      <small>{device.deviceId}</small>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
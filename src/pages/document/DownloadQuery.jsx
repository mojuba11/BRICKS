import React, { useState } from "react";
import { FaSearch, FaTimes, FaPlay, FaDownload, FaHistory } from "react-icons/fa";
import "./DownloadQuery.css";

export default function DownloadQuery() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [downloadData] = useState([
    { 
      id: 1, 
      preview: "https://via.placeholder.com/100x60/2a2a2a/c2a078?text=Evidence+01", 
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      userId: "BRICKS-ADMIN", 
      userName: "System Admin", 
      type: "Video", 
      time: "2026-03-29 10:52:43", 
      ip: "102.91.77.117" 
    },
    { 
      id: 2, 
      preview: "https://via.placeholder.com/100x60/2a2a2a/c2a078?text=Evidence+02", 
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      userId: "OPERATOR-01", 
      userName: "John Doe", 
      type: "Video", 
      time: "2026-03-28 16:33:10", 
      ip: "102.91.105.194" 
    }
  ]);

  return (
    <div className="dl-query-container">
      <div className="dl-tabs">
        <div className="tab active">
          <FaHistory style={{marginRight: '8px'}} /> Download Query ×
        </div>
      </div>

      <div className="dl-content-card">
        {/* FILTER BAR */}
        <div className="dl-filter-bar">
          <div className="input-group">
            <input type="text" placeholder="Search User ID..." className="dl-input" />
            <button className="dl-query-btn"><FaSearch /> Query logs</button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="dl-table-wrapper">
          <table className="dl-vms-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Preview (Click to Play)</th>
                <th>User ID</th>
                <th>User name</th>
                <th>Type</th>
                <th>Download time ↕</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {downloadData.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="dl-preview-box" onClick={() => setSelectedVideo(row.videoUrl)}>
                      <img src={row.preview} alt="preview" className="dl-thumb" />
                      <div className="dl-play-overlay">
                        <FaPlay size={14} />
                      </div>
                    </div>
                  </td>
                  <td className="text-bronze">{row.userId}</td>
                  <td>{row.userName}</td>
                  <td><span className="dl-type-tag">{row.type}</span></td>
                  <td>{row.time}</td>
                  <td className="text-muted">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TACTICAL VIDEO MODAL */}
      {selectedVideo && (
        <div className="dl-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="dl-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dl-modal-header">
              <span>Evidence Playback</span>
              <button className="dl-close-btn" onClick={() => setSelectedVideo(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="dl-modal-body">
              <video controls autoPlay className="dl-main-player">
                <source src={selectedVideo} type="video/mp4" />
                Browser not supported.
              </video>
            </div>
            <div className="dl-modal-footer">
              <button className="dl-download-btn"><FaDownload /> Re-download Evidence</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./DownloadQuery.css";

export default function DownloadQuery() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [downloadData] = useState([
    { 
      id: 1, 
      preview: "https://via.placeholder.com/100x60?text=Preview", 
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Sample video link
      userId: "BRICKS", 
      userName: "BRICKS", 
      type: "Video", 
      time: "2026-02-19 10:52:43", 
      ip: "102.91.77.117" 
    },
    { 
      id: 2, 
      preview: "https://via.placeholder.com/100x60?text=Preview", 
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      userId: "OPERATOR-01", 
      userName: "OPERATOR-01", 
      type: "Video", 
      time: "2026-02-18 16:33:10", 
      ip: "102.91.105.194" 
    }
  ]);

  return (
    <div className="dl-query-container">
      <div className="dl-tabs">
        <div className="tab active">Download Query ×</div>
      </div>

      <div className="dl-content-card">
        <div className="dl-filter-bar">
          <div className="input-group">
            <input type="text" placeholder="User ID" className="dl-input" />
            <button className="dl-query-btn"><FaSearch /> Query</button>
          </div>
        </div>

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
                <th>IPAddress</th>
              </tr>
            </thead>
            <tbody>
              {downloadData.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="preview-wrapper" onClick={() => setSelectedVideo(row.videoUrl)}>
                      <img src={row.preview} alt="preview" className="dl-thumb" />
                      <div className="play-overlay">▶</div>
                    </div>
                  </td>
                  <td>{row.userId}</td>
                  <td>{row.userName}</td>
                  <td><span className="dl-type-tag">{row.type}</span></td>
                  <td>{row.time}</td>
                  <td>{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedVideo(null)}>
              <FaTimes />
            </button>
            <video controls autoPlay className="main-preview-player">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
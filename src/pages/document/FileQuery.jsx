import React, { useState } from "react";
import { FaSearch, FaUpload, FaTrash, FaDownload, FaFileVideo, FaCamera, FaMicrophone, FaTimes } from "react-icons/fa";
import "./FileQuery.css";

export default function FileQuery() {
  const [selectedFile, setSelectedFile] = useState(null); // State for the Modal
  const [fileData] = useState([
    { id: 1, deviceId: "DEV-001", userName: "User-Alpha", dept: "Security", type: "Photo", ip: "192.168.1.10", thumb: "https://via.placeholder.com/80x50?text=Photo", url: "https://via.placeholder.com/600x400?text=Photo+Full+View" },
    { id: 2, deviceId: "DEV-002", userName: "User-Beta", dept: "Operations", type: "Audio", ip: "192.168.1.12", isAudio: true, url: "" },
    { id: 3, deviceId: "DEV-003", userName: "User-Gamma", dept: "Logistics", type: "Video", ip: "192.168.1.15", thumb: "https://via.placeholder.com/80x50?text=Video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ]);

  const openPreview = (file) => {
    if (file.type === "Audio") return; // Audio can have a different player later
    setSelectedFile(file);
  };

  return (
    <div className="file-query-container">
      {/* ... (Previous Tabs and Filter Grid stay the same) ... */}
      <div className="file-tabs">
        <div className="tab active">File Query ×</div>
      </div>

      <div className="file-content-card">
        {/* Filter and Action Bar (Hidden for brevity, keep your existing code here) */}
        
        <div className="file-table-wrapper">
          <table className="vms-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Operate</th>
                <th>Preview</th>
                <th>Device ID</th>
                <th>User name</th>
                <th>Type</th>
                <th>Station IP</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((file) => (
                <tr key={file.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="table-ops">
                      <button className="op-btn"><FaDownload size={12}/></button>
                      <button className="op-btn delete"><FaTrash size={12}/></button>
                    </div>
                  </td>
                  <td onClick={() => openPreview(file)} style={{ cursor: "pointer" }}>
                    <div className="preview-container">
                      {file.type === "Audio" ? (
                        <div className="audio-placeholder"><FaMicrophone /></div>
                      ) : (
                        <img src={file.thumb} alt="preview" className="table-thumb" />
                      )}
                      {file.type === "Video" && <FaFileVideo className="type-overlay-icon" />}
                    </div>
                  </td>
                  <td className="text-bold">{file.deviceId}</td>
                  <td>{file.userName}</td>
                  <td>
                    <span className={`type-tag ${file.type.toLowerCase()}`}>{file.type}</span>
                  </td>
                  <td>{file.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- VIDEO/PHOTO PREVIEW MODAL --- */}
      {selectedFile && (
        <div className="vms-modal-overlay" onClick={() => setSelectedFile(null)}>
          <div className="vms-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>{selectedFile.type} Evidence: {selectedFile.deviceId}</span>
              <button className="close-modal" onClick={() => setSelectedFile(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              {selectedFile.type === "Video" ? (
                <video controls autoPlay className="modal-video">
                  <source src={selectedFile.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={selectedFile.url} alt="Full Preview" className="modal-img" />
              )}
            </div>
            <div className="modal-footer">
               <button className="btn-query"><FaDownload /> Download Evidence</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
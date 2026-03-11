import React, { useState } from "react";
import { FaSearch, FaUpload, FaTrash, FaDownload } from "react-icons/fa";
import "./FileQuery.css";

export default function FileQuery() {
  // Generic mock data with neutralized labels
  const [fileData] = useState([
    { id: 1, deviceId: "DEV-001", userName: "User-Alpha", userId: "UID-101", dept: "Security", type: "Photo", ip: "192.168.1.10", thumb: "https://via.placeholder.com/80x50?text=Photo" },
    { id: 2, deviceId: "DEV-002", userName: "User-Beta", userId: "UID-102", dept: "Operations", type: "Audio", ip: "192.168.1.12", isAudio: true },
    { id: 3, deviceId: "DEV-003", userName: "User-Gamma", userId: "UID-103", dept: "Logistics", type: "Video", ip: "192.168.1.15", thumb: "https://via.placeholder.com/80x50?text=Video" },
  ]);

  return (
    <div className="file-query-container">
      <div className="file-tabs">
        <div className="tab active">File Query ×</div>
      </div>

      <div className="file-content-card">
        {/* TOP FILTER ROW */}
        <div className="filter-grid">
          <input type="text" placeholder="Device ID" className="f-input" />
          <input type="text" placeholder="User ID" className="f-input" />
          <select className="f-input"><option>Select departments</option></select>
          <select className="f-input"><option>Please choose File type</option></select>
        </div>

        {/* BOTTOM FILTER ROW */}
        <div className="filter-grid mt-10">
          <select className="f-input"><option>Please choose Video Quality</option></select>
          <input type="text" placeholder="User name" className="f-input" />
          <input type="text" placeholder="Start time (Shooting time)" className="f-input" />
          <input type="text" placeholder="End time (Shooting time)" className="f-input" />
          <input type="text" placeholder="Task order number" className="f-input" />
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-bar-row">
          <button className="btn-query"><FaSearch /> Query</button>
          <button className="btn-upload"><FaUpload /> Upload</button>
          <button className="btn-delete"><FaTrash /> Delete in batches</button>
        </div>

        {/* RESULTS TABLE */}
        <div className="file-table-wrapper">
          <table className="vms-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Operate</th>
                <th>Preview</th>
                <th>Device ID</th>
                <th>User name</th>
                <th>User ID</th>
                <th>Department</th>
                <th>Type</th>
                <th>StationIP</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((file) => (
                <tr key={file.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="table-ops">
                      <button className="op-btn" title="Download"><FaDownload size={12}/></button>
                      <button className="op-btn" title="Delete"><FaTrash size={12}/></button>
                    </div>
                  </td>
                  <td>
                    {file.isAudio ? (
                      <div className="audio-placeholder">🔊</div>
                    ) : (
                      <img src={file.thumb} alt="preview" className="table-thumb" />
                    )}
                  </td>
                  <td>{file.deviceId}</td>
                  <td>{file.userName}</td>
                  <td>{file.userId}</td>
                  <td>{file.dept}</td>
                  <td>
                    <span className={`type-tag ${file.type.toLowerCase()}`}>
                      {file.type}
                    </span>
                  </td>
                  <td>{file.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination-footer">
          <div className="page-left">
            <button className="p-nav">{"<"}</button>
            <span className="p-active">1</span>
            <button className="p-nav">{">"}</button>
            <span className="p-jump">To <input type="text" defaultValue="1" /> Page</span>
            <button className="p-confirm">Confirm</button>
          </div>
          <div className="page-right">
            <span>Total {fileData.length} Bar</span>
            <select className="p-select"><option>20 /Page</option></select>
          </div>
        </div>
      </div>
    </div>
  );
}
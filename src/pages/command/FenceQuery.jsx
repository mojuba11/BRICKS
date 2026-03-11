import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./FenceQuery.css";

export default function FenceQuery() {
  const [fenceData, setFenceData] = useState([
    { id: 1, deviceId: "DEV-101", fenceName: "Main Gate Zone", eventType: "Enter", time: "2026-03-04 08:30:00", department: "Security Alpha" },
    { id: 2, deviceId: "DEV-105", fenceName: "Restricted Area A", eventType: "Exit", time: "2026-03-04 09:12:45", department: "Admin South" },
    { id: 3, deviceId: "DEV-202", fenceName: "Warehouse Perimeter", eventType: "Enter", time: "2026-03-04 11:05:12", department: "Logistics" },
  ]);

  return (
    <div className="fence-page-container">
      {/* HEADER TAB */}
      <div className="fence-tabs">
        <div className="tab active">Fence Query ×</div>
      </div>

      <div className="fence-content-card">
        {/* FILTER BAR */}
        <div className="fence-filter-section">
          <div className="input-group">
            <input type="text" placeholder="Device ID" className="fence-input" />
            <input type="text" placeholder="Fence Name" className="fence-input" />
            <input type="text" placeholder="Start time" className="fence-input" onFocus={(e) => (e.target.type = "datetime-local")} onBlur={(e) => (e.target.type = "text")} />
            <input type="text" placeholder="End time" className="fence-input" onFocus={(e) => (e.target.type = "datetime-local")} onBlur={(e) => (e.target.type = "text")} />
            <button className="fence-query-button">
              <FaSearch /> Query
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="fence-table-container">
          <table className="fence-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Device ID</th>
                <th>Department</th>
                <th>Fence Name</th>
                <th>Event Type (Enter/Exit)</th>
                <th>Time ↕</th>
              </tr>
            </thead>
            <tbody>
              {fenceData.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.deviceId}</td>
                  <td>{row.department}</td>
                  <td>{row.fenceName}</td>
                  <td>
                    <span className={`status-pill ${row.eventType.toLowerCase()}`}>
                      {row.eventType}
                    </span>
                  </td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="fence-pagination">
          <div className="page-controls">
            <button className="page-btn">{"<"}</button>
            <span className="page-num active">1</span>
            <button className="page-btn">{">"}</button>
            <span className="page-jump">To <input type="text" defaultValue="1" /> Page</span>
            <button className="confirm-btn">Confirm</button>
          </div>
          <div className="page-info">
            <span>Total {fenceData.length} Bar</span>
            <select className="page-select">
              <option>20 /Page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import "./UserDataStatistics.css";

const UserDataStatistics = () => {
  // Keeping the state empty as requested earlier
  const [stats, setStats] = useState([]);

  const handleExport = () => {
    if (stats.length === 0) {
      alert("No data available to export.");
      return;
    }
    alert("Exporting to Excel...");
  };

  return (
    <div className="stats-container">
      <div className="filter-section">
        <div className="input-row">
          <input type="text" placeholder="Device ID" />
          <input type="text" placeholder="User ID" />
          <select>
            <option value="">Select departments</option>
          </select>
          <input type="text" placeholder="Start time" onFocus={(e) => (e.target.type = "date")} />
          <input type="text" placeholder="End time" onFocus={(e) => (e.target.type = "date")} />
        </div>
        <div className="button-row">
          <button className="query-btn">🔍 Query</button>
          <button className="export-btn" onClick={handleExport}>📥 Export Excel</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User name</th>
              <th>User ID</th>
              <th>Device ID</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Graphics</th>
              <th>Video</th>
              <th>Audio</th>
              <th>Other</th>
              <th>Save Time</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.userName}</td>
                  <td>{row.userId}</td>
                  <td>{row.deviceId}</td>
                  <td>{row.dept}</td>
                  <td>{row.phone}</td>
                  <td>{row.total}</td>
                  <td>{row.graphics}</td>
                  <td>{row.video}</td>
                  <td>{row.audio}</td>
                  <td>{row.other}</td>
                  <td><span className="save-badge">{row.saveTime}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                  No data available. Click Query to search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDataStatistics;
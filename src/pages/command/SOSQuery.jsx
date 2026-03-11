import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SOSQuery.css";

export default function SOSQuery() {
  const [sosData, setSosData] = useState([
    { id: 1, deviceId: "DEV-001", department: "Department A", userName: "User 01", time: "2026-03-04 10:20:15", phone: "---", loginName: "user01" },
    { id: 2, deviceId: "DEV-002", department: "Department B", userName: "User 02", time: "2026-03-04 09:15:22", phone: "---", loginName: "user02" },
    { id: 3, deviceId: "DEV-003", department: "Department C", userName: "User 03", time: "2026-03-03 14:45:10", phone: "---", loginName: "user03" },
  ]);

  return (
    <div className="sos-page-container">
      {/* HEADER TABS - Cleaned up */}
      <div className="sos-tabs">
        <div className="tab active">SOS Query ×</div>
      </div>

      <div className="sos-content-card">
        {/* FILTER SECTION */}
        <div className="sos-filter-section">
          <div className="input-group">
            <input type="text" placeholder="Device ID" className="sos-input" />
            <input type="text" placeholder="User name" className="sos-input" />
            <input type="text" placeholder="Start time" className="sos-input" onFocus={(e) => (e.target.type = "datetime-local")} onBlur={(e) => (e.target.type = "text")} />
            <input type="text" placeholder="End time" className="sos-input" onFocus={(e) => (e.target.type = "datetime-local")} onBlur={(e) => (e.target.type = "text")} />
            <button className="sos-query-button">
              <FaSearch /> Query
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="sos-table-container">
          <table className="sos-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Device ID</th>
                <th>Department</th>
                <th>User name</th>
                <th>Time ↕</th>
                <th>Phone Number</th>
                <th>Login name</th>
              </tr>
            </thead>
            <tbody>
              {sosData.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.deviceId}</td>
                  <td>{row.department}</td>
                  <td>{row.userName}</td>
                  <td>{row.time}</td>
                  <td>{row.phone}</td>
                  <td>{row.loginName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="sos-pagination">
          <div className="page-controls">
            <button className="page-btn">{"<"}</button>
            <span className="page-num active">1</span>
            <button className="page-btn">{">"}</button>
            <span className="page-jump">To <input type="text" defaultValue="1" /> Page</span>
            <button className="confirm-btn">Confirm</button>
          </div>
          <div className="page-info">
            <span>Total {sosData.length} Bar</span>
            <select className="page-select">
              <option>20 /Page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
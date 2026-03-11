import React, { useState } from "react";
import "./UserCheckStatistics.css";

const UserCheckStatistics = () => {
  // Mock data for user check-in/out logs
  const [logs] = useState([
    { id: 1, name: "Admin", userId: "USR001", type: "Check-in", time: "2026-03-05 08:30:12", location: "Main Office", status: "Normal" },
    { id: 2, name: "Officer_A", userId: "USR042", type: "Check-in", time: "2026-03-05 08:45:05", location: "Sector 7", status: "Normal" },
    { id: 3, name: "Officer_B", userId: "USR015", type: "Check-in", time: "2026-03-05 09:15:44", location: "Remote Port", status: "Late" },
  ]);

  return (
    <div className="check-stats-container">
      <div className="stats-header">
        <div className="query-group">
          <input type="text" placeholder="User ID / Name" />
          <select>
            <option>All Status</option>
            <option>Normal</option>
            <option>Late</option>
            <option>Absent</option>
          </select>
          <input type="date" />
          <button className="query-btn">🔍 Query</button>
          <button className="export-btn">📥 Export Excel</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>User ID</th>
              <th>Check Type</th>
              <th>Time</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.name}</td>
                <td>{log.userId}</td>
                <td>{log.type}</td>
                <td>{log.time}</td>
                <td>{log.location}</td>
                <td>
                  <span className={`status-tag ${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCheckStatistics;
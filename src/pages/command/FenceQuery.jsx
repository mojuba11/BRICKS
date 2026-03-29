import React, { useState, useEffect } from "react";
import { FaSearch, FaDrawPolygon, FaFileExport, FaSync } from "react-icons/fa";
import "./FenceQuery.css";

export default function FenceQuery() {
  const [fenceData, setFenceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    deviceId: "",
    fenceName: "",
    startTime: "",
    endTime: ""
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";

  const fetchFenceLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`${API_BASE}/api/fence-logs?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setFenceData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fence Query Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFenceLogs();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="fence-page-container">
      <div className="fence-tabs">
        <div className="tab active">
          <FaDrawPolygon size={12} style={{ marginRight: "6px" }} /> 
          Fence Query ×
        </div>
      </div>

      <div className="fence-content-card">
        {/* FILTER BAR */}
        <div className="fence-filter-section">
          <div className="input-group">
            <input name="deviceId" type="text" placeholder="Device ID" className="fence-input" onChange={handleInputChange} />
            <input name="fenceName" type="text" placeholder="Fence Name" className="fence-input" onChange={handleInputChange} />
            
            <div className="date-inputs">
              <input name="startTime" type="text" placeholder="Start time" className="fence-input" onFocus={(e) => (e.target.type = "datetime-local")} onBlur={(e) => (e.target.type = "text")} onChange={handleInputChange} />
              <span>to</span>
              <input name="endTime" type="text" placeholder="End time" className="fence-input" onFocus={(e) => (e.target.type = "datetime-local")} onBlur={(e) => (e.target.type = "text")} onChange={handleInputChange} />
            </div>

            <button className="fence-query-button" onClick={fetchFenceLogs} disabled={loading}>
              {loading ? <FaSync className="spin" /> : <FaSearch />} Query
            </button>
            <button className="fence-export-button">
              <FaFileExport /> Export
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
                <th>Event Type</th>
                <th>Time ↕</th>
              </tr>
            </thead>
            <tbody>
              {fenceData.length > 0 ? (
                fenceData.map((row, index) => (
                  <tr key={row._id || index}>
                    <td>{index + 1}</td>
                    <td className="text-bold">{row.deviceId}</td>
                    <td>{row.department || "Field Ops"}</td>
                    <td>{row.fenceName}</td>
                    <td>
                      <span className={`status-pill ${row.eventType?.toLowerCase()}`}>
                        {row.eventType}
                      </span>
                    </td>
                    <td>{row.time ? new Date(row.time).toLocaleString() : "---"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#888" }}>
                    {loading ? "Fetching geofence records..." : "No geofence events found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="fence-pagination">
          <div className="page-info">Total {fenceData.length} records found</div>
          <div className="page-controls">
            <button className="page-btn">{"<"}</button>
            <span className="page-num active">1</span>
            <button className="page-btn">{">"}</button>
            <button className="confirm-btn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { FaSearch, FaFileExport, FaSync } from "react-icons/fa";
import "./SOSQuery.css";

export default function SOSQuery() {
  const [sosData, setSosData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    deviceId: "",
    userName: "",
    startTime: "",
    endTime: ""
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";

  // Function to fetch data with filters
  const fetchSOSLogs = async () => {
    setLoading(true);
    try {
      // Construct query string
      const params = new URLSearchParams();
      if (filters.deviceId) params.append("deviceId", filters.deviceId);
      if (filters.userName) params.append("userName", filters.userName);
      if (filters.startTime) params.append("startTime", filters.startTime);
      if (filters.endTime) params.append("endTime", filters.endTime);

      const res = await fetch(`${API_BASE}/api/sos?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setSosData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Query Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSOSLogs();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="sos-page-container">
      <div className="sos-tabs">
        <div className="tab active">SOS Query ×</div>
      </div>

      <div className="sos-content-card">
        <div className="sos-filter-section">
          <div className="input-group">
            <input 
              type="text" 
              name="deviceId"
              placeholder="Device ID" 
              className="sos-input" 
              onChange={handleInputChange}
            />
            <input 
              type="text" 
              name="userName"
              placeholder="User name" 
              className="sos-input" 
              onChange={handleInputChange}
            />
            
            <div className="date-inputs">
              <input 
                name="startTime"
                type="text" 
                placeholder="Start time" 
                className="sos-input" 
                onFocus={(e) => (e.target.type = "datetime-local")} 
                onBlur={(e) => (e.target.type = "text")}
                onChange={handleInputChange}
              />
              <span>to</span>
              <input 
                name="endTime"
                type="text" 
                placeholder="End time" 
                className="sos-input" 
                onFocus={(e) => (e.target.type = "datetime-local")} 
                onBlur={(e) => (e.target.type = "text")}
                onChange={handleInputChange}
              />
            </div>

            <button className="sos-query-button" onClick={fetchSOSLogs} disabled={loading}>
              {loading ? <FaSync className="spin" /> : <FaSearch />} Query
            </button>
            
            <button className="sos-export-button" onClick={() => alert("Exporting to CSV...")}>
              <FaFileExport /> Export
            </button>
          </div>
        </div>

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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sosData.length > 0 ? (
                sosData.map((row, index) => (
                  <tr key={row._id || index}>
                    <td>{index + 1}</td>
                    <td className="text-bold">{row.deviceId}</td>
                    <td>{row.department || "N/A"}</td>
                    <td>{row.userName}</td>
                    <td>{new Date(row.time).toLocaleString()}</td>
                    <td>{row.phone || "---"}</td>
                    <td>{row.loginName || "---"}</td>
                    <td><span className="sos-badge">Emergency</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    {loading ? "Searching database..." : "No SOS logs found for this criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination remains the same as previous step */}
      </div>
    </div>
  );
}
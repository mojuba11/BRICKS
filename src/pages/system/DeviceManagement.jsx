import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeviceManagement.css";

// Environment-aware fallback base selection
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
const API_URL = `${API_BASE}/api/device`;
const DEPT_URL = `${API_BASE}/api/departments`;

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Updated state metrics to conform with hardware device attributes
  const initialFormState = {
    deviceId: "", deviceName: "", capacity: "", firm: "", dept: "",
    deviceState: "Normal", 
    videoServer: "GB/T 28181 Standard", // Optimized modern infrastructure default
    recordVideo: "No", gpsType: "WGS84", gpsInterval: "1000",
    enableFence: "No", fenceName: "", fenceAlarm: "No",
    hardwareSerial: "", deviceSerial: "", hardwareVersion: "",
    softwareVersion: "", intelligentAnalysis: "",
    streamUrl: "", // Now populated automatically by your media gateway webhooks
    streamEndpoint: "", // Gateway dual-key tracking alignment support
    status: "Offline" // State tracking variable linked to database
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [devRes, deptRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(DEPT_URL).catch(() => ({ data: [] }))
      ]);
      setDevices(devRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error("Fetch operations mismatch exception:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (device = null) => {
    if (device) {
      setEditingDevice(device);
      setForm({ ...device });
    } else {
      setEditingDevice(null);
      setForm(initialFormState);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        const res = await axios.put(`${API_URL}/${editingDevice._id}`, form);
        setDevices(devices.map(d => d._id === editingDevice._id ? res.data : d));
      } else {
        const res = await axios.post(API_URL, form);
        setDevices([...devices, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Infrastructure API connection timeout.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to completely de-register this bodycam?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setDevices(devices.filter(d => d._id !== id));
      } catch (err) {
        alert("Deletion sequence failed.");
      }
    }
  };

  // Click handler to open the streaming link safely in a new window
  const handleWatchStream = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="device-mgmt-container" style={{ padding: "20px", width: "100%", maxWidth: "1200px", margin: "0 auto", boxSizing: "border-box" }}>
      <div className="device-mgmt-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div className="title-section">
          <h2 style={{ margin: 0, fontSize: "24px", color: "#333" }}>Device Management Panel</h2>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>Total Registered Assets: <strong>{devices.length}</strong></p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()} style={{ padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>+ Register Bodycam</button>
      </div>

      <div className="table-wrapper" style={{ width: "100%", overflowX: "auto", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6", color: "#495057" }}>
              <th style={{ padding: "12px 15px" }}>Device Hardware ID</th>
              <th style={{ padding: "12px 15px" }}>Unit Name</th>
              <th style={{ padding: "12px 15px" }}>Protocol Standard</th>
              <th style={{ padding: "12px 15px" }}>Operating Status</th>
              <th style={{ padding: "12px 15px" }}>Live Feed Link</th>
              <th style={{ padding: "12px 15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-cell" style={{ padding: "30px", textAlign: "center", color: "#666" }}>Syncing database matrix channels...</td></tr>
            ) : devices.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#999" }}>No registered hardware units found inside this profile.</td></tr>
            ) : devices.map((dev) => {
              const activeStream = dev.streamUrl || dev.streamEndpoint;
              return (
                <tr key={dev._id} style={{ borderBottom: "1px solid #dee2e6", transition: "background 0.2s" }}>
                  <td style={{ padding: "12px 15px" }}><code>{dev.deviceId}</code></td>
                  <td style={{ padding: "12px 15px" }}><strong>{dev.deviceName}</strong></td>
                  <td style={{ padding: "12px 15px" }}><small className="server-tag" style={{ background: "#e9ecef", padding: "3px 6px", borderRadius: "3px" }}>{dev.videoServer}</small></td>
                  <td style={{ padding: "12px 15px" }}>
                    <span className={`status-badge ${dev.status?.toLowerCase() || 'offline'}`} style={{ fontWeight: "6px" }}>
                      {dev.status || "Offline"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 15px" }}>
                    {activeStream ? (
                      <button 
                        onClick={() => handleWatchStream(activeStream)} 
                        style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", fontWeight: "bold", cursor: "pointer", padding: 0, fontSize: "14px" }}
                      >
                        🔗 Link Active
                      </button>
                    ) : (
                      <span style={{ color: "#999" }}>Idle</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 15px", whiteSpace: "nowrap" }}>
                    <button className="edit-link" onClick={() => handleOpenModal(dev)} style={{ padding: "4px 10px", marginRight: "8px", background: "#f0f0f0", border: "1px solid #ccc", borderRadius: "3px", cursor: "pointer" }}>Configure</button>
                    <button className="delete-link" onClick={() => handleDelete(dev._id)} style={{ padding: "4px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }}>Wipe</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="modal-content" style={{ background: "#fff", borderRadius: "8px", width: "90%", maxWidth: "720px", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", overflow: "hidden", animation: "fadeIn 0.2s ease-out" }}>
            
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 25px", borderBottom: "1px solid #e9ecef", background: "#f8f9fa" }}>
               <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>{editingDevice ? "Modify Asset Configurations" : "Provision New Hardware Unit"}</h3>
               <button className="close-btn" onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "28px", color: "#aaa", cursor: "pointer", lineHeight: 1 }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", margin: 0 }}>
              
              {/* Internal Fluid Scroll Boundary Box */}
              <div className="modal-body-scroll" style={{ padding: "25px", overflowY: "auto", flex: 1, maxHeight: "calc(85vh - 120px)", boxSizing: "border-box" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="input-group" style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>Device ID Hardware Code</label>
                      <input 
                        style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }}
                        placeholder="e.g., 783624"
                        value={form.deviceId} 
                        onChange={(e) => setForm({...form, deviceId: e.target.value})} 
                        disabled={editingDevice ? true : false} 
                        required 
                      />
                    </div>
                    <div className="input-group" style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>Assigned Unit/Officer Name</label>
                      <input style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px" }} value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="input-group" style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>Inbound Protocol Standard</label>
                      <select style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", background: "#fff" }} value={form.videoServer} onChange={(e) => setForm({...form, videoServer: e.target.value})}>
                        <option value="GB/T 28181 Standard">GB/T 28181 Standard</option>
                        <option value="Direct RTSP/RTMP Stream">Direct RTSP / RTMP Network Feed</option>
                        <option value="Custom Stream Relay Gateway">Custom Stream Relay Gateway</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>Department Routing</label>
                      <select style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", background: "#fff" }} value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})}>
                        <option value="">Select Station Department</option>
                        <option value="Rita">Rita</option>
                        {departments.map(d => (
                          <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fully Editable Manual Stream Input Override Field */}
                  <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>Live Stream Direct URL (Input Link Directly)</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input 
                        style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", flex: 1, background: "#fff", color: "#333" }}
                        placeholder="Paste network link here (e.g., http://10.24.21.92:8080/video)"
                        value={form.streamUrl || ""} 
                        onChange={(e) => setForm({
                          ...form, 
                          streamUrl: e.target.value, 
                          streamEndpoint: e.target.value 
                        })} 
                      />
                      {(form.streamUrl || form.streamEndpoint) && (
                        <button 
                          type="button" 
                          onClick={() => handleWatchStream(form.streamUrl || form.streamEndpoint)}
                          style={{ padding: "0 15px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px", whiteSpace: "nowrap" }}
                        >
                          🔗 Open Link
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="input-group" style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>GPS Mapping Topology</label>
                      <select style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", background: "#fff" }} value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                        <option value="WGS84">WGS84 (Global Standard GPS)</option>
                        <option value="GCJ02">GCJ02 (Encrypted Topology Standard)</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontWeight: "600", fontSize: "13px", color: "#495057" }}>System Diagnostics State</label>
                      <select style={{ padding: "8px 12px", border: "1px solid #ced4da", borderRadius: "4px", fontSize: "14px", background: "#fff" }} value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                        <option value="Normal">Operational / Normal</option>
                        <option value="Alarm">SOS Alarm Event Active</option>
                        <option value="Maintenance">Maintenance Lockdown</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom-Locked Action Buttons Tray */}
              <div className="modal-footer" style={{ padding: "15px 25px", borderTop: "1px solid #e9ecef", background: "#f8f9fa", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #ced4da", borderRadius: "4px", color: "#495057", cursor: "pointer", fontWeight: "500" }}>Close</button>
                <button type="submit" className="submit-btn" style={{ padding: "8px 16px", background: "#007bff", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer", fontWeight: "600" }}>{editingDevice ? "Apply Overrides" : "Initialize Unit"}</button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;

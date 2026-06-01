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

  return (
    <div className="device-mgmt-container">
      <div className="device-mgmt-header">
        <div className="title-section">
          <h2>Device Management Panel</h2>
          <p>Total Registered Assets: <strong>{devices.length}</strong></p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Register Bodycam</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Device Hardware ID</th>
              <th>Unit Name</th>
              <th>Protocol Standard</th>
              <th>Operating Status</th>
              <th>Live Feed Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-cell">Syncing database matrix channels...</td></tr>
            ) : devices.map((dev) => (
              <tr key={dev._id}>
                <td><code>{dev.deviceId}</code></td>
                <td><strong>{dev.deviceName}</strong></td>
                <td><small className="server-tag">{dev.videoServer}</small></td>
                <td>
                  {/* Dynamic Status Badging mirroring our backend hooks updates */}
                  <span className={`status-badge ${dev.status?.toLowerCase() || 'offline'}`}>
                    {dev.status || "Offline"}
                  </span>
                </td>
                <td>
                  {/* Patched conditional to support both streamUrl and streamEndpoint tracking payloads */}
                  <span className={(dev.streamUrl || dev.streamEndpoint) ? "stream-ok" : "stream-none"}>
                    {(dev.streamUrl || dev.streamEndpoint) ? "📡 Active Broadcast" : "Idle"}
                  </span>
                </td>
                <td>
                  <button className="edit-link" onClick={() => handleOpenModal(dev)}>Configure</button>
                  <button className="delete-link" onClick={() => handleDelete(dev._id)}>Wipe</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
               <h3>{editingDevice ? "Modify Asset Configurations" : "Provision New Hardware Unit"}</h3>
               <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Hardware Device ID (SIP ID)</label>
                  <input 
                    placeholder="e.g., 34020000001320000001"
                    value={form.deviceId} 
                    onChange={(e) => setForm({...form, deviceId: e.target.value})} 
                    disabled={editingDevice ? true : false} // Lock Device ID once registered to ensure hardware tracking stability
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Assigned Unit/Officer Name</label>
                  <input value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                </div>

                <div className="input-group">
                  <label>Ingestion Inbound Protocol</label>
                  {/* Fixed value tags here to preserve matching alignment criteria during configuration changes */}
                  <select value={form.videoServer} onChange={(e) => setForm({...form, videoServer: e.target.value})}>
                    <option value="GB/T 28181 Standard">GB/T 28181 Standard</option>
                    <option value="Direct RTSP/RTMP Stream">Direct RTSP / RTMP Network Feed</option>
                    <option value="Custom Stream Relay Gateway">Custom Stream Relay Gateway</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Department Routing</label>
                  <select value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})}>
                    <option value="">Select Station Department</option>
                    <option value="Rita">Rita</option> {/* Support hardcoded station name mapping matches */}
                    {departments.map(d => (
                      <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group full-width">
                  <label>Live Stream Watch URL (Automated Feed Field)</label>
                  {/* Dual parsing logic handles either string fallback so the interface remains reactive */}
                  <input 
                    className="read-only-input"
                    readOnly
                    placeholder={(form.streamUrl || form.streamEndpoint) ? "" : "No active pipeline—waiting for hardware unit broadcast signal..."}
                    value={form.streamUrl || form.streamEndpoint || ""} 
                  />
                </div>

                <div className="input-group">
                  <label>GPS Mapping System</label>
                  <select value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                    <option value="WGS84">WGS84 (Global Standard GPS)</option>
                    <option value="GCJ02">GCJ02 (Encrypted Topology Standard)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>System Diagnostics State</label>
                  <select value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                    <option value="Normal">Operational / Normal</option>
                    <option value="Alarm">SOS Alarm Event Active</option>
                    <option value="Maintenance">Maintenance Lockdown</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Close</button>
                <button type="submit" className="submit-btn">{editingDevice ? "Apply Overrides" : "Initialize Unit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;

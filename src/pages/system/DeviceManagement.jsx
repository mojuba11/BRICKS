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
    <div className="device-mgmt-container">
      <div className="device-mgmt-header">
        <div className="title-section">
          <h2>Device Management Panel</h2>
          <p>Total Registered Assets: <strong>{devices.length}</strong></p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Register Bodycam</button>
      </div>

      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Device Hardware ID</th>
              <th>Unit Name</th>
              <th>Department</th>
              <th>GPS Type</th>
              <th>GPS sending interval</th>
              <th>Online status</th>
              <th>State</th>
              <th>Capacity</th>
              <th>Firm</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="loading-cell">Syncing database matrix channels...</td></tr>
            ) : devices.map((dev) => {
              const activeStream = dev.streamUrl || dev.streamEndpoint;
              return (
                <tr key={dev._id}>
                  <td><code>{dev.deviceId}</code></td>
                  <td><strong>{dev.deviceName}</strong></td>
                  <td>{dev.dept || "Unassigned"}</td>
                  <td>{dev.gpsType}</td>
                  <td>{dev.gpsInterval} ms</td>
                  <td>
                    <span className={`status-badge ${dev.status?.toLowerCase() || 'offline'}`}>
                      {dev.status || "Offline"}
                    </span>
                  </td>
                  <td>
                    <span className={`state-pill ${dev.deviceState?.toLowerCase() || 'normal'}`}>
                      {dev.deviceState || "Normal"}
                    </span>
                  </td>
                  <td>{dev.capacity ? `${dev.capacity} GB` : "0 GB"}</td>
                  <td>{dev.firm || "N/A"}</td>
                  <td>
                    <button className="check-link" onClick={() => activeStream ? handleWatchStream(activeStream) : alert("Device stream is currently offline.")} style={{ marginRight: "5px" }}>Check</button>
                    <button className="edit-link" onClick={() => handleOpenModal(dev)} style={{ marginRight: "5px" }}>Modify</button>
                    <button className="delete-link" onClick={() => handleDelete(dev._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "900px" }}>
            <div className="modal-header">
               <h3>{editingDevice ? "Modify Asset Configurations" : "Provision New Hardware Unit"}</h3>
               <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                
                {/* LEFT COLUMN FIELDS */}
                <div className="left-form-column">
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>*Device ID</label>
                    <input 
                      placeholder="e.g., Bravo01"
                      value={form.deviceId} 
                      onChange={(e) => setForm({...form, deviceId: e.target.value})} 
                      disabled={editingDevice ? true : false} 
                      required 
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Device name</label>
                    <input value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Capacity (GB)</label>
                    <input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} placeholder="128" />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Firm</label>
                    <input value={form.firm} onChange={(e) => setForm({...form, firm: e.target.value})} placeholder="Testing" />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>*Department</label>
                    <select value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})} required>
                      <option value="">Select Department</option>
                      <option value="Maritime Security">Maritime Security</option>
                      <option value="Air Surveillance">Air Surveillance</option>
                      <option value="Rita">Rita</option>
                      {departments.map(d => (
                        <option key={d._id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Device state</label>
                    <select value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                      <option value="Normal">Normal</option>
                      <option value="Alarm">SOS Alarm Event Active</option>
                      <option value="Maintenance">Maintenance Lockdown</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Video server</label>
                    <select value={form.videoServer} onChange={(e) => setForm({...form, videoServer: e.target.value})}>
                      <option value="GB/T 28181 Standard">GB/T 28181 Standard</option>
                      <option value="Video Server H264+AAC">Video Server H264+AAC</option>
                      <option value="Direct RTSP/RTMP Stream">Direct RTSP / RTMP Network Feed</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Record video</label>
                    <select value={form.recordVideo} onChange={(e) => setForm({...form, recordVideo: e.target.value})}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>GPS Type</label>
                    <select value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                      <option value="WGS84">WGS84 (Global Standard GPS)</option>
                      <option value="GCJ02">GCJ02 (Encrypted Topology Standard)</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>GPS sending interval (ms)</label>
                    <input type="number" value={form.gpsInterval} onChange={(e) => setForm({...form, gpsInterval: e.target.value})} placeholder="1000" />
                  </div>
                </div>

                {/* RIGHT COLUMN FIELDS */}
                <div className="right-form-column">
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Enable the fence</label>
                    <select value={form.enableFence} onChange={(e) => setForm({...form, enableFence: e.target.value})}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Fence name</label>
                    <input value={form.fenceName} onChange={(e) => setForm({...form, fenceName: e.target.value})} placeholder="Select fence or enter name" />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Fence alarm</label>
                    <select value={form.fenceAlarm} onChange={(e) => setForm({...form, fenceAlarm: e.target.value})}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Hardware serial number</label>
                    <input value={form.hardwareSerial} onChange={(e) => setForm({...form, hardwareSerial: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Device serial number</label>
                    <input value={form.deviceSerial} onChange={(e) => setForm({...form, deviceSerial: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Hardware version number</label>
                    <input value={form.hardwareVersion} onChange={(e) => setForm({...form, hardwareVersion: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Software version number</label>
                    <input value={form.softwareVersion} onChange={(e) => setForm({...form, softwareVersion: e.target.value})} />
                  </div>
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Intelligent analysis</label>
                    <input value={form.intelligentAnalysis} onChange={(e) => setForm({...form, intelligentAnalysis: e.target.value})} />
                  </div>
                  
                  {/* Hidden streaming layer sync mappings (Preserved behind the scenes for API integrations) */}
                  <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Manual Stream Direct Input Override</label>
                    <input 
                      value={form.streamUrl || ""} 
                      onChange={(e) => setForm({
                        ...form, 
                        streamUrl: e.target.value, 
                        streamEndpoint: e.target.value 
                      })} 
                      placeholder="Optional: Direct connection URL string override" 
                    />
                  </div>
                </div>

              </div>
              <div className="modal-footer" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{editingDevice ? "Save Changes" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;

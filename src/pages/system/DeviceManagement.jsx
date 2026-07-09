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

  // Synchronized form state initialization block
  const initialFormState = {
    deviceId: "", 
    deviceName: "", 
    capacity: "", 
    firm: "", 
    dept: "",
    deviceState: "Normal", 
    videoServer: "Video Server H264+AAC", 
    recordVideo: "No", 
    gpsType: "WGS84", 
    gpsInterval: "1000",
    enableFence: "No", 
    fenceName: "", 
    fenceAlarm: "No",
    hardwareSerial: "", 
    deviceSerial: "", 
    hardwareVersion: "",
    softwareVersion: "", 
    intelligentAnalysis: "",
    streamUrl: "" 
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
      console.error("Fetch error", err);
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
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this device?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setDevices(devices.filter(d => d._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleWatchStream = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="device-mgmt-container" style={{ padding: "20px", width: "100%", boxSizing: "border-box" }}>
      <div className="device-mgmt-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div className="title-section">
          <h2 style={{ margin: 0 }}>Device Management</h2>
          <p style={{ margin: "5px 0 0 0" }}>Total Registered: <strong>{devices.length}</strong></p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Register Device</button>
      </div>

      <div className="table-wrapper" style={{ width: "100%", overflowX: "auto", background: "#fff", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Server Type</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Stream</th>
              <th style={{ padding: "12px" }}>Operate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-cell" style={{ padding: "20px", textAlign: "center" }}>Loading...</td></tr>
            ) : devices.map((dev) => (
              <tr key={dev._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: "12px" }}>{dev.deviceId}</td>
                <td style={{ padding: "12px" }}>{dev.deviceName}</td>
                <td style={{ padding: "12px" }}><small>{dev.videoServer}</small></td>
                <td style={{ padding: "12px" }}>
                  <span className={`state-pill ${dev.deviceState?.toLowerCase() || 'normal'}`}>
                    {dev.deviceState || "Normal"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  {dev.streamUrl ? (
                    <button 
                      onClick={() => handleWatchStream(dev.streamUrl)}
                      style={{ background: "none", border: "none", color: "#007bff", textDecoration: "underline", fontWeight: "bold", cursor: "pointer", padding: 0 }}
                    >
                      🔗 Link Active
                    </button>
                  ) : (
                    <span style={{ color: "#999" }}>No Link</span>
                  )}
                </td>
                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                  <button className="edit-link" onClick={() => handleOpenModal(dev)} style={{ marginRight: "5px" }}>Modify</button>
                  <button className="delete-link" onClick={() => handleDelete(dev._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div className="modal-content" style={{ background: "#fff", borderRadius: "6px", width: "90%", maxWidth: "800px", maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #dee2e6", background: "#f8f9fa" }}>
               <h3 style={{ margin: 0 }}>{editingDevice ? "Modify Device Settings" : "Register New Device"}</h3>
               <button className="close-btn" onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", margin: 0 }}>
              <div className="modal-body-scroll" style={{ padding: "20px", overflowY: "auto", flex: 1, maxHeight: "calc(85vh - 120px)" }}>
                
                {/* Clean inline-fallback definition grid layout block */}
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  
                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Device ID</label>
                      <input style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.deviceId} onChange={(e) => setForm({...form, deviceId: e.target.value})} required />
                    </div>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Device Name</label>
                      <input style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Video Server Type</label>
                      <select style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.videoServer} onChange={(e) => setForm({...form, videoServer: e.target.value})}>
                        <option value="Video Server H264+AAC">Video Server H264+AAC</option>
                        <option value="GB/T 28181 Standard">GB/T 28181 Standard</option>
                        <option value="RTSP.me">RTSP.me (Cloud Embed)</option>
                        <option value="DroidCam">DroidCam (Local IP)</option>
                        <option value="YouTube">YouTube Live</option>
                        <option value="Wowza">Wowza Cloud</option>
                        <option value="AntMedia">Ant Media Server</option>
                        <option value="Generic">Generic / Other</option>
                      </select>
                    </div>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Department</label>
                      <select style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})}>
                        <option value="">Select Department</option>
                        <option value="Maritime Security">Maritime Security</option>
                        <option value="Air Surveillance">Air Surveillance</option>
                        <option value="Rita">Rita</option>
                        {departments.map(d => (
                          <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fully Editable Live Stream Input Box Configuration */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", fontWeight: "500", color: "#007bff" }}>Live Stream URL Endpoint (Direct Input Entry)</label>
                    <input 
                      style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da" }}
                      placeholder="Input streaming endpoint link directly (e.g., http://10.24.21.92:8080/video)" 
                      value={form.streamUrl || ""} 
                      onChange={(e) => setForm({...form, streamUrl: e.target.value})} 
                    />
                  </div>

                  <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>GPS Standard</label>
                      <select style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                        <option value="WGS84">WGS84 (Global)</option>
                        <option value="GCJ02">GCJ02 (China)</option>
                      </select>
                    </div>
                    <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Operating State</label>
                      <select style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                        <option value="Normal">Normal</option>
                        <option value="Alarm">Alarm</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="modal-footer" style={{ padding: "15px 20px", borderTop: "1px solid #dee2e6", display: "flex", justifyContent: "flex-end", gap: "10px", background: "#f8f9fa" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)} style={{ padding: "6px 12px", border: "1px solid #ced4da", background: "#fff", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="submit-btn" style={{ padding: "6px 12px", border: "none", background: "#007bff", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>{editingDevice ? "Save Changes" : "Register Device"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;

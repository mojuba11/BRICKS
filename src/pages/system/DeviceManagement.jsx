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

  // Expanded form state to match the video configuration structure cleanly
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
    streamUrl: "",
    status: "Offline"
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

      {/* Main Table Structure matching Video Data Headers */}
      <div className="table-wrapper" style={{ width: "100%", overflowX: "auto", background: "#fff", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th style={{ padding: "12px" }}>Device ID</th>
              <th style={{ padding: "12px" }}>Device name</th>
              <th style={{ padding: "12px" }}>Department</th>
              <th style={{ padding: "12px" }}>GPS Type</th>
              <th style={{ padding: "12px" }}>GPS sending interval</th>
              <th style={{ padding: "12px" }}>Online status</th>
              <th style={{ padding: "12px" }}>State</th>
              <th style={{ padding: "12px" }}>Capacity</th>
              <th style={{ padding: "12px" }}>Firm</th>
              <th style={{ padding: "12px" }}>Operate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="loading-cell" style={{ padding: "20px", textAlign: "center" }}>Loading...</td></tr>
            ) : devices.map((dev) => (
              <tr key={dev._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: "12px" }}><code>{dev.deviceId}</code></td>
                <td style={{ padding: "12px" }}>{dev.deviceName}</td>
                <td style={{ padding: "12px" }}>{dev.dept || "Unassigned"}</td>
                <td style={{ padding: "12px" }}>{dev.gpsType}</td>
                <td style={{ padding: "12px" }}>{dev.gpsInterval} ms</td>
                <td style={{ padding: "12px" }}>
                  <span className={`status-badge ${dev.status?.toLowerCase() || 'offline'}`}>
                    {dev.status || "Offline"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span className={`state-pill ${dev.deviceState?.toLowerCase() || 'normal'}`}>
                    {dev.deviceState || "Normal"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{dev.capacity ? `${dev.capacity} GB` : "0 GB"}</td>
                <td style={{ padding: "12px" }}>{dev.firm || "N/A"}</td>
                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                  <button className="check-link" onClick={() => dev.streamUrl ? handleWatchStream(dev.streamUrl) : alert("No active stream found.")} style={{ marginRight: "5px", padding: "4px 8px", cursor: "pointer" }}>Check</button>
                  <button className="edit-link" onClick={() => handleOpenModal(dev)} style={{ marginRight: "5px", padding: "4px 8px", cursor: "pointer" }}>Modify</button>
                  <button className="delete-link" onClick={() => handleDelete(dev._id)} style={{ padding: "4px 8px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Structured Layout Form Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="modal-content" style={{ background: "#fff", borderRadius: "4px", width: "90%", maxWidth: "850px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #dee2e6" }}>
               <h3 style={{ margin: 0 }}>{editingDevice ? "BatchEdit device" : "Add device"}</h3>
               <button className="close-btn" onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden", margin: 0 }}>
              <div className="modal-body-scroll" style={{ padding: "20px", overflowY: "auto", flex: 1, maxHeight: "calc(90vh - 130px)" }}>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  
                  {/* COLUMN ONE */}
                  <div className="form-column">
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>*Device ID</label>
                      <input 
                        style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }}
                        value={form.deviceId} 
                        onChange={(e) => setForm({...form, deviceId: e.target.value})} 
                        disabled={editingDevice ? true : false} 
                        required 
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Device name</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Capacity (GB)</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} placeholder="128" />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Firm</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.firm} onChange={(e) => setForm({...form, firm: e.target.value})} placeholder="Testing" />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>*Department</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})} required>
                        <option value="">Select Department</option>
                        <option value="Maritime Security">Maritime Security</option>
                        <option value="Air Surveillance">Air Surveillance</option>
                        <option value="Rita">Rita</option>
                        {departments.map(d => (
                          <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Device state</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                        <option value="Normal">Normal</option>
                        <option value="Alarm">Alarm</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Video server</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.videoServer} onChange={(e) => setForm({...form, videoServer: e.target.value})}>
                        <option value="Video Server H264+AAC">Video Server H264+AAC</option>
                        <option value="GB/T 28181 Standard">GB/T 28181 Standard</option>
                        <option value="Direct RTSP/RTMP Stream">Direct RTSP / RTMP Feed</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Record video</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.recordVideo} onChange={(e) => setForm({...form, recordVideo: e.target.value})}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>GPS Type</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                        <option value="WGS84">WGS84</option>
                        <option value="GCJ02">GCJ02</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>GPS sending interval (ms)</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} type="number" value={form.gpsInterval} onChange={(e) => setForm({...form, gpsInterval: e.target.value})} />
                    </div>
                  </div>

                  {/* COLUMN TWO */}
                  <div className="form-column">
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Enable the fence</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.enableFence} onChange={(e) => setForm({...form, enableFence: e.target.value})}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Fence name</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.fenceName} onChange={(e) => setForm({...form, fenceName: e.target.value})} placeholder="Please choose" />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Fence alarm</label>
                      <select style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fff" }} value={form.fenceAlarm} onChange={(e) => setForm({...form, fenceAlarm: e.target.value})}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Hardware serial number</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.hardwareSerial} onChange={(e) => setForm({...form, hardwareSerial: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Device serial number</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.deviceSerial} onChange={(e) => setForm({...form, deviceSerial: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Hardware version number</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.hardwareVersion} onChange={(e) => setForm({...form, hardwareVersion: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Software version number</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.softwareVersion} onChange={(e) => setForm({...form, softwareVersion: e.target.value})} />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500" }}>Intelligent analysis</label>
                      <input style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da" }} value={form.intelligentAnalysis} onChange={(e) => setForm({...form, intelligentAnalysis: e.target.value})} />
                    </div>
                    
                    {/* Fully Open Manual Streaming Endpoint Input Field Override */}
                    <div className="input-group" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                      <label style={{ marginBottom: "5px", fontWeight: "500", color: "#007bff" }}>Live Streaming URL Link Direct Entry</label>
                      <input 
                        style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ced4da", background: "#fdfdfd" }} 
                        value={form.streamUrl || ""} 
                        onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} 
                        placeholder="Paste testing feed here (e.g., http://10.24.21.92:8080/video)"
                      />
                    </div>
                  </div>

                </div>
              </div>
              <div className="modal-footer" style={{ padding: "15px 20px", borderTop: "1px solid #dee2e6", display: "flex", justifyContent: "flex-end", gap: "10px", background: "#f8f9fa" }}>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)} style={{ padding: "6px 12px", border: "1px solid #ced4da", background: "#fff", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="submit-btn" style={{ padding: "6px 12px", border: "none", background: "#007bff", color: "#fff", borderRadius: "4px", cursor: "pointer" }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;

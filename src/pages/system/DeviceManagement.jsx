import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeviceManagement.css";

// Use environment variable for the backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bricks-backend-7wnv.onrender.com";
const API_URL = `${API_BASE}/api/device`;
const DEPT_URL = `${API_BASE}/api/departments`;

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [departments, setDepartments] = useState([]); // Added to sync with your system
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    deviceId: "", deviceName: "", capacity: "", firm: "", dept: "",
    deviceState: "Normal", videoServer: "Video Server H264+AAC",
    recordVideo: "No", gpsType: "WGS84", gpsInterval: "1000",
    enableFence: "No", fenceName: "", fenceAlarm: "No",
    hardwareSerial: "", deviceSerial: "", hardwareVersion: "",
    softwareVersion: "", intelligentAnalysis: "",
    streamUrl: "" 
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both devices and departments at once
      const [devRes, deptRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(DEPT_URL).catch(() => ({ data: [] })) // Fallback if dept API fails
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
      alert(err.response?.data?.message || "Operation failed. Ensure Backend model matches form fields.");
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

  return (
    <div className="device-mgmt-container">
      <div className="device-mgmt-header">
        <div className="title-section">
          <h2>Device Management</h2>
          <p>Total Registered: <strong>{devices.length}</strong></p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>+ Register Device</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Status</th>
              <th>Stream</th>
              <th>Operate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-cell">Loading Devices...</td></tr>
            ) : devices.map((dev) => (
              <tr key={dev._id}>
                <td>{dev.deviceId}</td>
                <td>{dev.deviceName}</td>
                <td>{dev.dept || "Unassigned"}</td>
                <td>
                  <span className={`state-pill ${dev.deviceState.toLowerCase()}`}>
                    {dev.deviceState}
                  </span>
                </td>
                <td>
                  <span className={dev.streamUrl ? "stream-ok" : "stream-none"}>
                    {dev.streamUrl ? "🔗 Active" : "No Link"}
                  </span>
                </td>
                <td>
                  <button className="edit-link" onClick={() => handleOpenModal(dev)}>Modify</button>
                  <button className="delete-link" onClick={() => handleDelete(dev._id)}>Delete</button>
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
               <h3>{editingDevice ? "Modify Device Settings" : "Register New Device"}</h3>
               <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Device ID</label>
                  <input value={form.deviceId} onChange={(e) => setForm({...form, deviceId: e.target.value})} required placeholder="e.g. BC-001" />
                </div>
                <div className="input-group">
                  <label>Device Name</label>
                  <input value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Department</label>
                  <select value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})}>
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group full-width">
                  <label>Live Stream URL</label>
                  <input 
                    placeholder="rtsp://admin:password@ip:port" 
                    value={form.streamUrl} 
                    onChange={(e) => setForm({...form, streamUrl: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>GPS Standard</label>
                  <select value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                    <option value="WGS84">WGS84 (Global)</option>
                    <option value="GCJ02">GCJ02 (China)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Operating State</label>
                  <select value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                    <option value="Normal">Normal</option>
                    <option value="Alarm">Alarm</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{editingDevice ? "Save Changes" : "Register Device"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
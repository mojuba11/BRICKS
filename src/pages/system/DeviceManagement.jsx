import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DeviceManagement.css";

const API_URL = "https://bricks-backend-7wnv.onrender.com/api/device";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Added streamUrl to the initial state
  const initialFormState = {
    deviceId: "", deviceName: "", capacity: "", firm: "", dept: "",
    deviceState: "Normal", videoServer: "Video Server H264+AAC",
    recordVideo: "No", gpsType: "WGS84", gpsInterval: "1000",
    enableFence: "No", fenceName: "", fenceAlarm: "No",
    hardwareSerial: "", deviceSerial: "", hardwareVersion: "",
    softwareVersion: "", intelligentAnalysis: "",
    streamUrl: "" // NEW: For Live Camera Sync
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setDevices(res.data);
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
      alert(err.response?.data?.message || "Operation failed");
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
          <p>Total Devices: {devices.length}</p>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => handleOpenModal()}>
            + Add New Device
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Device Name</th>
              <th>Dept</th>
              <th>State</th>
              <th>GPS Type</th>
              <th>Live Stream</th>
              <th>Operate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7">Loading...</td></tr>
            ) : devices.length > 0 ? (
              devices.map((dev) => (
                <tr key={dev._id}>
                  <td>{dev.deviceId}</td>
                  <td>{dev.deviceName}</td>
                  <td>{dev.dept}</td>
                  <td>
                    <span className={`state-pill ${dev.deviceState.toLowerCase()}`}>
                      {dev.deviceState}
                    </span>
                  </td>
                  <td>{dev.gpsType}</td>
                  <td>{dev.streamUrl ? "✅ Configured" : "❌ No Link"}</td>
                  <td>
                    <button className="edit-link" onClick={() => handleOpenModal(dev)}>Modify</button>
                    <button className="delete-link" onClick={() => handleDelete(dev._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="empty-row">No devices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingDevice ? "Modify Device" : "Register New Device"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Device ID (Unique)</label>
                  <input value={form.deviceId} onChange={(e) => setForm({...form, deviceId: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Device Name</label>
                  <input value={form.deviceName} onChange={(e) => setForm({...form, deviceName: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Department</label>
                  <input value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Live Camera Stream URL</label>
                  <input 
                    placeholder="rtsp://... or http://..." 
                    value={form.streamUrl} 
                    onChange={(e) => setForm({...form, streamUrl: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>GPS Type</label>
                  <select value={form.gpsType} onChange={(e) => setForm({...form, gpsType: e.target.value})}>
                    <option value="WGS84">WGS84</option>
                    <option value="GCJ02">GCJ02</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Device State</label>
                  <select value={form.deviceState} onChange={(e) => setForm({...form, deviceState: e.target.value})}>
                    <option value="Normal">Normal</option>
                    <option value="Alarm">Alarm</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed
import "./DeviceManagement.css";

const API_URL = "https://bricks-backend-7wnv.onrender.com/api/fences";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    deviceId: "", deviceName: "", capacity: "", firm: "", dept: "",
    deviceState: "Normal", videoServer: "Video Server H264+AAC",
    recordVideo: "No", gpsType: "WGS84", gpsInterval: "1000",
    enableFence: "No", fenceName: "", fenceAlarm: "No",
    hardwareSerial: "", deviceSerial: "", hardwareVersion: "",
    softwareVersion: "", intelligentAnalysis: ""
  });

  // 1. Fetch devices on component mount
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
      setForm({
        deviceId: "", deviceName: "", capacity: "", firm: "", dept: "",
        deviceState: "Normal", videoServer: "Video Server H264+AAC",
        recordVideo: "No", gpsType: "WGS84", gpsInterval: "1000",
        enableFence: "No", fenceName: "", fenceAlarm: "No",
        hardwareSerial: "", deviceSerial: "", hardwareVersion: "",
        softwareVersion: "", intelligentAnalysis: ""
      });
    }
    setShowModal(true);
  };

  // 2. Updated Submit for API
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

  // 3. Updated Delete for API
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
      {/* ... Header Search Bar remains same ... */}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Device ID</th>
              <th>Device Name</th>
              <th>Dept</th>
              <th>State</th>
              <th>Capacity (GB)</th>
              <th>GPS Type</th>
              <th>Operate</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading devices...</td></tr>
            ) : devices.length > 0 ? devices.map((dev) => (
              <tr key={dev._id}> {/* Use MongoDB _id */}
                <td><input type="checkbox" /></td>
                <td>{dev.deviceId}</td>
                <td>{dev.deviceName}</td>
                <td>{dev.dept}</td>
                <td>
                  <span className={`state-pill ${dev.deviceState.toLowerCase()}`}>
                    {dev.deviceState}
                  </span>
                </td>
                <td>{dev.capacity}</td>
                <td>{dev.gpsType}</td>
                <td>
                  <button className="edit-link" onClick={() => handleOpenModal(dev)}>Modify</button>
                  <button className="delete-link" onClick={() => handleDelete(dev._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" className="empty-row">No devices registered.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ... Modal Code remains the same ... */}
    </div>
  );
};

export default DeviceManagement;
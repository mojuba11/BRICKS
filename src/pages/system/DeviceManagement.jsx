import React, { useState } from "react";
import "./DeviceManagement.css";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // Form state based on image_bd9a7c.png
  const [form, setForm] = useState({
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
    intelligentAnalysis: ""
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDevice) {
      setDevices(devices.map(d => d.id === editingDevice.id ? { ...form, id: d.id } : d));
    } else {
      setDevices([...devices, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <div className="device-mgmt-container">
      <div className="header-actions">
        <div className="search-bar">
          <input type="text" placeholder="Device ID" />
          <input type="text" placeholder="Device Name" />
          <select><option>Select departments</option></select>
          <select><option>Device State</option></select>
          <button className="query-btn">🔍 Query</button>
        </div>
        <div className="batch-actions">
          <button className="add-device-btn" onClick={() => handleOpenModal()}>+ Add device</button>
          <button className="batch-btn orange">🗑️ Delete in batches</button>
          <button className="batch-btn blue">📥 Import</button>
        </div>
      </div>

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
            {devices.length > 0 ? devices.map((dev) => (
              <tr key={dev.id}>
                <td><input type="checkbox" /></td>
                <td>{dev.deviceId}</td>
                <td>{dev.deviceName}</td>
                <td>{dev.dept}</td>
                <td><span className={`state-pill ${dev.deviceState.toLowerCase()}`}>{dev.deviceState}</span></td>
                <td>{dev.capacity}</td>
                <td>{dev.gpsType}</td>
                <td>
                  <button className="edit-link" onClick={() => handleOpenModal(dev)}>Modify</button>
                  <button className="delete-link" onClick={() => setDevices(devices.filter(d => d.id !== dev.id))}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" className="empty-row">No devices registered.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card large">
            <div className="modal-header">
              <h3>{editingDevice ? "Modify Device" : "Add Device"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="device-form">
              <div className="form-columns">
                {/* Left Column */}
                <div className="column">
                  <div className="form-item">
                    <label><span className="required">*</span>Device ID</label>
                    <input type="text" required value={form.deviceId} onChange={e => setForm({...form, deviceId: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Device name</label>
                    <input type="text" value={form.deviceName} onChange={e => setForm({...form, deviceName: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Capacity (GB)</label>
                    <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Firm</label>
                    <input type="text" value={form.firm} onChange={e => setForm({...form, firm: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label><span className="required">*</span>Department</label>
                    <select required value={form.dept} onChange={e => setForm({...form, dept: e.target.value})}>
                      <option value="">Select departments</option>
                      <option value="NIGERIA HQ">NIGERIA HQ</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>Device state</label>
                    <select value={form.deviceState} onChange={e => setForm({...form, deviceState: e.target.value})}>
                      <option value="Normal">Normal</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>Video server</label>
                    <select value={form.videoServer} onChange={e => setForm({...form, videoServer: e.target.value})}>
                      <option value="Video Server H264+AAC">Video Server H264+AAC</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>Record video</label>
                    <select value={form.recordVideo} onChange={e => setForm({...form, recordVideo: e.target.value})}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>GPS Type</label>
                    <select value={form.gpsType} onChange={e => setForm({...form, gpsType: e.target.value})}>
                      <option value="WGS84">WGS84</option>
                      <option value="Baidu">Baidu</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>GPS sending interval (ms)</label>
                    <input type="number" value={form.gpsInterval} onChange={e => setForm({...form, gpsInterval: e.target.value})} />
                  </div>
                </div>

                {/* Right Column */}
                <div className="column">
                  <div className="form-item">
                    <label>Enable the fence</label>
                    <select value={form.enableFence} onChange={e => setForm({...form, enableFence: e.target.value})}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>Fence name</label>
                    <select value={form.fenceName} onChange={e => setForm({...form, fenceName: e.target.value})}>
                      <option value="">Please choose</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>Fence alarm</label>
                    <select value={form.fenceAlarm} onChange={e => setForm({...form, fenceAlarm: e.target.value})}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="form-item">
                    <label>Hardware serial number</label>
                    <input type="text" value={form.hardwareSerial} onChange={e => setForm({...form, hardwareSerial: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Device serial number</label>
                    <input type="text" value={form.deviceSerial} onChange={e => setForm({...form, deviceSerial: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Hardware version number</label>
                    <input type="text" value={form.hardwareVersion} onChange={e => setForm({...form, hardwareVersion: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Software version number</label>
                    <input type="text" value={form.softwareVersion} onChange={e => setForm({...form, softwareVersion: e.target.value})} />
                  </div>
                  <div className="form-item">
                    <label>Intelligent analysis</label>
                    <input type="text" value={form.intelligentAnalysis} onChange={e => setForm({...form, intelligentAnalysis: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="save-btn">Confirm</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
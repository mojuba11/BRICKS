import React, { useState } from "react";
import "./FenceManagement.css";

const FenceManagement = () => {
  const [fences, setFences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    state: "No going out" // Default state option
  });

  const handleAddFence = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newFence = {
      id: Date.now(),
      name: form.name,
      state: form.state,
    };

    setFences([...fences, newFence]);
    setForm({ name: "", state: "No going out" });
    setShowModal(false);
  };

  return (
    <div className="fence-container">
      {/* LEFT PANE: Fence List */}
      <div className="list-pane">
        <div className="pane-header">
          <input type="text" placeholder="Fence Query" className="search-input" />
          <button className="query-btn">🔍 Query</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add fence</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fence name</th>
                <th>State</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>
              {fences.length > 0 ? (
                fences.map((fence) => (
                  <tr key={fence.id}>
                    <td>{fence.name}</td>
                    <td>{fence.state}</td>
                    <td>
                      <button className="delete-link" onClick={() => setFences(fences.filter(f => f.id !== fence.id))}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="no-data">No Data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT PANE: Map Area (Placeholder for Google/Leaflet Maps) */}
      <div className="map-pane">
        <div className="map-controls">
          <input type="text" placeholder="Search location..." className="map-search" />
          <button className="map-btn teal">🔍</button>
          <button className="map-btn orange">Polygon</button>
          <button className="map-btn blue">Rectangle</button>
          <button className="map-btn teal">Circle</button>
        </div>
        <div className="map-placeholder">
          <div className="map-mockup">
             {/* This is where your Google Maps / Leaflet component would render */}
             <p>Interactive Map View</p>
             <span className="coordinate-hint">Map data ©2026 Google</span>
          </div>
        </div>
      </div>

      {/* DIALOG: Add Fence */}
      {showModal && (
        <div className="modal-overlay">
          <div className="fence-modal">
            <div className="modal-header">
              <h3>Add Fence</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddFence}>
              <div className="form-item">
                <label>Fence Name</label>
                <input 
                  type="text" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Enter fence name"
                />
              </div>
              <div className="form-item">
                <label>State</label>
                <select 
                  value={form.state} 
                  onChange={(e) => setForm({...form, state: e.target.value})}
                >
                  <option value="No going out">No going out</option>
                  <option value="No entry">No entry</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="submit" className="confirm-btn">Confirm</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FenceManagement;
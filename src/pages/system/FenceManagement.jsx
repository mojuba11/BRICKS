import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FenceManagement.css";

// ✅ LIVE BACKEND
const API_URL = "https://bricks-backend-7wnv.onrender.com/api/fences";

const FenceManagement = () => {
  const [fences, setFences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    state: "No going out"
  });

  // ✅ FETCH FENCES
  useEffect(() => {
    fetchFences();
  }, []);

  const fetchFences = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);
      setFences(res.data);

    } catch (err) {
      console.error("Failed to fetch fences:", err);
      alert("Failed to load fences");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD FENCE
  const handleAddFence = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    try {
      const res = await axios.post(API_URL, form);

      setFences([...fences, res.data]);
      setForm({ name: "", state: "No going out" });
      setShowModal(false);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving fence");
    }
  };

  // ✅ DELETE FENCE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fence?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);

        setFences(fences.filter((f) => f._id !== id));

      } catch (err) {
        console.error(err);
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="fence-container">

      {/* LEFT PANEL */}
      <div className="list-pane">
        <div className="pane-header">
          <input type="text" placeholder="Fence Query" className="search-input" />
          <button className="query-btn">🔍 Query</button>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add fence
          </button>
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
              {loading ? (
                <tr><td colSpan="3">Loading...</td></tr>

              ) : fences.length > 0 ? (
                fences.map((fence) => (
                  <tr key={fence._id}>
                    <td>{fence.name}</td>
                    <td>{fence.state}</td>
                    <td>
                      <button
                        className="delete-link"
                        onClick={() => handleDelete(fence._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT PANEL (MAP MOCK) */}
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
            <p>Interactive Map View</p>
            <span className="coordinate-hint">Map data ©2026</span>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="fence-modal">
            <div className="modal-header">
              <h3>Add Fence</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddFence}>
              <div className="form-item">
                <label>Fence Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter fence name"
                />
              </div>

              <div className="form-item">
                <label>State</label>
                <select
                  value={form.state}
                  onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                  }
                >
                  <option value="No going out">No going out</option>
                  <option value="No entry">No entry</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="confirm-btn">
                  Confirm
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FenceManagement;
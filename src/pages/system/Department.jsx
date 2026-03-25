import React, { useState, useEffect } from "react";
import "./Department.css";

function Department() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ LIVE BACKEND
  const API_BASE = "https://bricks-backend-7wnv.onrender.com/api/departments";

  const [form, setForm] = useState({ 
    name: "", 
    superiorDept: "", 
    deptNumber: "", 
    saveTime: "Forever",
    remark: "",
    status: "Active" 
  });

  // ✅ LOAD DATA
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_BASE);
      const data = await response.json();

      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      alert("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API_BASE}/${editing._id}` : API_BASE;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await fetchDepartments();
        resetForm();
      } else {
        alert("Failed to save department.");
      }
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Server error");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setDepartments(departments.filter((d) => d._id !== id));
        } else {
          alert("Delete failed");
        }
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };

  const handleEdit = (dept) => {
    setEditing(dept);
    setForm({ ...dept });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      superiorDept: "",
      deptNumber: "",
      saveTime: "Forever",
      remark: "",
      status: "Active",
    });
    setEditing(null);
    setShowModal(false);
  };

  return (
    <div className="department-container">
      <div className="page-header">
        <h2>Department Management</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + Add Department
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading Departments...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Department Name</th>
                <th>Dept Number</th>
                <th>Superior Dept</th>
                <th>Keep Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {departments.length > 0 ? (
                departments.map((dept, index) => (
                  <tr key={dept._id}>
                    <td>{index + 1}</td>
                    <td><strong>{dept.name}</strong></td>
                    <td>{dept.deptNumber}</td>
                    <td>{dept.superiorDept}</td>
                    <td><span className="save-badge">{dept.saveTime}</span></td>
                    <td>
                      <span className={`status-pill ${dept.status.toLowerCase()}`}>
                        {dept.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(dept)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(dept._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">No Departments Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? "Modify Department" : "Add Department"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Superior Department</label>
                  <select
                    value={form.superiorDept}
                    onChange={(e) =>
                      setForm({ ...form, superiorDept: e.target.value })
                    }
                  >
                    <option value="">Select Superior</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="Regional Command">Regional Command</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Department Number</label>
                  <input
                    type="text"
                    value={form.deptNumber}
                    onChange={(e) =>
                      setForm({ ...form, deptNumber: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>File Keep Time</label>
                  <select
                    value={form.saveTime}
                    onChange={(e) =>
                      setForm({ ...form, saveTime: e.target.value })
                    }
                  >
                    <option value="Forever">Forever</option>
                    <option value="1 Year">1 Year</option>
                    <option value="3 Years">3 Years</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Remarks</label>
                  <textarea
                    rows="2"
                    value={form.remark}
                    onChange={(e) =>
                      setForm({ ...form, remark: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
                <button type="button" className="secondary-btn" onClick={resetForm}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Department;
import React, { useState } from "react";
import "./Department.css";

function Department() {
  const [departments, setDepartments] = useState([
    { 
      id: 1, 
      name: "Operations", 
      superiorDept: "Headquarters",
      deptNumber: "D-101",
      saveTime: "Forever",
      remark: "Main field operations unit",
      status: "Active" 
    },
    { 
      id: 2, 
      name: "Surveillance", 
      superiorDept: "Regional Command",
      deptNumber: "D-202",
      saveTime: "1 Year",
      remark: "Camera monitoring unit",
      status: "Active" 
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Initialized with the new fields you requested
  const [form, setForm] = useState({ 
    name: "", 
    superiorDept: "", 
    deptNumber: "", 
    saveTime: "Forever",
    remark: "",
    status: "Active" 
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing) {
      setDepartments(
        departments.map((dept) =>
          dept.id === editing.id ? { ...dept, ...form } : dept
        )
      );
    } else {
      const newDept = {
        id: Date.now(),
        ...form,
      };
      setDepartments([...departments, newDept]);
    }

    resetForm();
  };

  const handleEdit = (dept) => {
    setEditing(dept);
    setForm({ ...dept });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };

  const resetForm = () => {
    setForm({ 
      name: "", 
      superiorDept: "", 
      deptNumber: "", 
      saveTime: "Forever", 
      remark: "", 
      status: "Active" 
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
            {departments.map((dept, index) => (
              <tr key={dept.id}>
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
                  <button className="delete-btn" onClick={() => handleDelete(dept.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    onChange={(e) => setForm({ ...form, superiorDept: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Department Number</label>
                  <input
                    type="text"
                    value={form.deptNumber}
                    onChange={(e) => setForm({ ...form, deptNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>File Keep Time</label>
                  <select 
                    value={form.saveTime} 
                    onChange={(e) => setForm({ ...form, saveTime: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="primary-btn">Save Changes</button>
                <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Department;
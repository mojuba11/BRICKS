import React, { useState } from "react";
import "./UserManagement.css";

function UserManagement() {
  // Records NNO1, NNO2, and NNO3 have been removed as requested.
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({
    userId: "",
    userName: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dept: "",
    gender: "Male",
    role: "User",
    isDeptAdmin: false,
    deviceId: "",
    remark: "",
    state: "Enable"
  });

  const handleEdit = (user) => {
    setEditing(user);
    setForm({
      ...user,
      password: "", 
      confirmPassword: ""
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (editing) {
      setUsers(users.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ 
      userId: "", userName: "", password: "", confirmPassword: "", 
      phone: "", dept: "", gender: "Male", role: "User", 
      isDeptAdmin: false, deviceId: "", remark: "", state: "Enable" 
    });
  };

  return (
    <div className="user-page">
      <div className="query-section">
        <div className="input-group">
          <input type="text" placeholder="User ID" />
          <input type="text" placeholder="Device ID" />
          <select><option>Select departments</option></select>
          <select><option>Gender</option></select>
          <button className="query-btn">🔍 Query</button>
        </div>
        <div className="action-btns">
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Add user</button>
          <button className="batch-delete-btn">🗑️ Delete in batches</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>User ID</th>
              <th>Department</th>
              <th>User Name</th>
              <th>Device ID</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>State</th>
              <th>Operate</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td><input type="checkbox" /></td>
                  <td>{user.userId}</td>
                  <td>{user.dept}</td>
                  <td>{user.userName}</td>
                  <td>{user.deviceId}</td>
                  <td>
                    <span className={`gender-tag ${user.gender.toLowerCase()}`}>
                      {user.gender}
                    </span>
                  </td>
                  <td>{user.phone}</td>
                  <td><span className="state-enable">{user.state}</span></td>
                  <td>
                    <button className="modify-btn" onClick={() => handleEdit(user)}>Modify</button>
                    <button className="delete-btn" onClick={() => setUsers(users.filter(u => u.id !== user.id))}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  No users found. Click "+ Add user" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modify-card">
            <div className="card-header">
              <h3>{editing ? "Modify User" : "Add User"}</h3>
              <button className="close-x" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-item">
                  <label>* User ID</label>
                  <input type="text" required value={form.userId} onChange={(e) => setForm({...form, userId: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* User Name</label>
                  <input type="text" required value={form.userName} onChange={(e) => setForm({...form, userName: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* User Password</label>
                  <input type="password" required={!editing} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* Confirm Password</label>
                  <input type="password" required={!editing} value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* Phone Number</label>
                  <input type="text" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* Department</label>
                  <select required value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})}>
                    <option value="">Select</option>
                    <option value="NIGERIA HQ">NIGERIA HQ</option>
                  </select>
                </div>
                <div className="form-item">
                  <label>Gender</label>
                  <div className="radio-row">
                    <label><input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={(e) => setForm({...form, gender: e.target.value})} /> Male</label>
                    <label><input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={(e) => setForm({...form, gender: e.target.value})} /> Female</label>
                  </div>
                </div>
                <div className="form-item">
                  <label>Role Management</label>
                  <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-item checkbox-group">
                  <label>Department Administrator</label>
                  <input type="checkbox" checked={form.isDeptAdmin} onChange={(e) => setForm({...form, isDeptAdmin: e.target.checked})} />
                </div>
                <div className="form-item">
                  <label>Device</label>
                  <input type="text" value={form.deviceId} onChange={(e) => setForm({...form, deviceId: e.target.value})} placeholder="Bind device ID" />
                </div>
                <div className="form-item full-width">
                  <label>Remark</label>
                  <textarea rows="2" value={form.remark} onChange={(e) => setForm({...form, remark: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>User Status</label>
                  <select value={form.state} onChange={(e) => setForm({...form, state: e.target.value})}>
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="confirm-btn">Confirm</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
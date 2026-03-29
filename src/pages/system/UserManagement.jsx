import React, { useState, useEffect } from "react";
import { userAPI } from "../../services/api";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({
    userId: "", userName: "", email: "", password: "", confirmPassword: "",
    dept: "", state: "Enable", role: "User"
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dRes, uRes] = await Promise.all([userAPI.getDepartments(), userAPI.getAll()]);
      setDepartments(dRes.data || []);
      setUsers(uRes.data || []);
    } catch (err) { console.error("Load failed", err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert("Passwords mismatch!");
    
    try {
      if (editing) {
        await userAPI.update(editing._id || editing.id, form);
      } else {
        await userAPI.create(form);
      }
      loadData();
      closeModal();
    } catch (err) { alert(err.response?.data?.message || "Save failed"); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ userId: "", userName: "", email: "", password: "", confirmPassword: "", dept: "", state: "Enable", role: "User" });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-page">
      <button className="add-btn" onClick={() => setShowModal(true)}>+ Add User</button>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>User ID</th><th>Name</th><th>Email</th><th>Dept</th><th>State</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.userId}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.dept}</td>
                <td>{user.state}</td>
                <td>
                  <button onClick={() => {
                    setEditing(user);
                    setForm({ ...user, password: "", confirmPassword: "" });
                    setShowModal(true);
                  }}>Modify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form className="modify-card" onSubmit={handleSubmit}>
            <h3>{editing ? "Edit User" : "Add User"}</h3>
            <input placeholder="User ID" value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} required />
            <input placeholder="User Name" value={form.userName} onChange={e => setForm({...form, userName: e.target.value})} required />
            <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <select value={form.dept} onChange={e => setForm({...form, dept: e.target.value})} required>
              <option value="">Select Dept</option>
              {departments.map(d => <option key={d._id} value={d.name}>{d.name}</option>)}
            </select>
            <input type="password" placeholder="New Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editing} />
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} required={!editing} />
            <button type="submit">Confirm</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
export default UserManagement;
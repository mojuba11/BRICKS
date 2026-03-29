import React, { useState, useEffect } from "react";
import { userAPI } from "../../services/api";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Search state
  const [queryId, setQueryId] = useState("");
  const [queryDept, setQueryDept] = useState("");

  const [form, setForm] = useState({
    userId: "", userName: "", email: "", password: "", confirmPassword: "",
    phone: "", dept: "", gender: "Male", role: "User",
    isDeptAdmin: false, deviceId: "", remark: "", state: "Enable"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userRes, deptRes] = await Promise.all([
        userAPI.getAll(),
        userAPI.getDepartments()
      ]);
      setUsers(userRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic for the Query button
  const handleQuery = async () => {
    try {
      setLoading(true);
      const res = await userAPI.query({ userId: queryId, dept: queryDept });
      setUsers(res.data);
    } catch (err) {
      console.error("Query failed:", err);
      loadData(); // Fallback to reload everything
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      if (editing) {
        await userAPI.update(editing._id || editing.id, form);
      } else {
        await userAPI.create(form);
      }
      loadData(); 
      closeModal();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user permanently?")) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter(u => (u._id || u.id) !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ 
      userId: "", userName: "", email: "", password: "", confirmPassword: "", 
      phone: "", dept: "", gender: "Male", role: "User", 
      isDeptAdmin: false, deviceId: "", remark: "", state: "Enable" 
    });
  };

  if (loading) return <div className="loading">Connecting to Bricks Backend...</div>;

  return (
    <div className="user-page">
      {/* Search / Query Section */}
      <div className="query-section">
        <div className="query-item">
          <label>User ID</label>
          <input type="text" value={queryId} onChange={(e) => setQueryId(e.target.value)} placeholder="Search ID..." />
        </div>
        <div className="query-item">
          <label>Department</label>
          <select value={queryDept} onChange={(e) => setQueryDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d._id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
        <button className="query-btn" onClick={handleQuery}>Query</button>
        <button className="reset-btn" onClick={() => {setQueryId(""); setQueryDept(""); loadData();}}>Reset</button>
      </div>

      <div className="action-btns">
         <button className="add-btn" onClick={() => setShowModal(true)}>+ Add user</button>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>State</th>
              <th>Operate</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user.userId}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.dept}</td>
                  <td>{user.state}</td>
                  <td>
                    <button className="modify-btn" onClick={() => {
                      setEditing(user);
                      setForm({...user, password: "", confirmPassword: ""});
                      setShowModal(true);
                    }}>Modify</button>
                    <button className="delete-btn" onClick={() => handleDelete(user._id || user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No users found. Click "Query" to refresh if backend was sleeping.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
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
                  <label>* Email Address</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* User Name</label>
                  <input type="text" required value={form.userName} onChange={(e) => setForm({...form, userName: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* Department</label>
                  <select required value={form.dept} onChange={(e) => setForm({...form, dept: e.target.value})}>
                    <option value="">Select Dept</option>
                    {departments.map(d => (
                      <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-item">
                  <label>* Password</label>
                  <input type="password" required={!editing} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
                </div>
                <div className="form-item">
                  <label>* Confirm Password</label>
                  <input type="password" required={!editing} value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
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
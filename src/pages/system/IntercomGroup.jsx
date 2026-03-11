import React, { useState } from "react";
import "./IntercomGroup.css";

const IntercomGroup = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");

  // Personnel state for the right-hand table
  const [personnel, setPersonnel] = useState([]);

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!groupNameInput.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: groupNameInput,
    };

    setGroups([...groups, newGroup]);
    setGroupNameInput("");
    setShowGroupModal(false);
  };

  return (
    <div className="intercom-container">
      {/* LEFT PANE: Group Management */}
      <div className="left-pane">
        <div className="pane-header">
          <input type="text" placeholder="Enter the name of the intercom" className="search-input" />
          <button className="query-btn">🔍 Query</button>
          <button className="add-btn" onClick={() => setShowGroupModal(true)}>+ Add</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <tr 
                    key={group.id} 
                    className={selectedGroup?.id === group.id ? "selected-row" : ""}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <td>{group.name}</td>
                    <td>
                      <button className="delete-link" onClick={() => setGroups(groups.filter(g => g.id !== group.id))}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2" className="no-data">No Data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT PANE: Personnel Management */}
      <div className="right-pane">
        <div className="pane-header">
          <input type="text" placeholder="User ID" className="search-input" />
          <input type="text" placeholder="User name" className="search-input" />
          <button className="query-btn">🔍 Query</button>
          <button className="add-person-btn">+ Add personnel</button>
        </div>
        <div className="batch-actions">
          <button className="batch-delete-btn">🗑️ Delete in batches</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>User ID</th>
                <th>User name</th>
                <th>Device ID</th>
                <th>Department</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>
              {personnel.length > 0 ? (
                personnel.map((p) => (
                  <tr key={p.id}>
                    <td><input type="checkbox" /></td>
                    <td>{p.userId}</td>
                    <td>{p.userName}</td>
                    <td>{p.deviceId}</td>
                    <td>{p.dept}</td>
                    <td><button className="delete-link">Delete</button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="no-data">No Data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add Intercom Group */}
      {showGroupModal && (
        <div className="modal-overlay">
          <div className="small-modal">
            <div className="modal-header">
              <h3>Add Intercom Group</h3>
              <button className="close-x" onClick={() => setShowGroupModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddGroup}>
              <div className="form-item">
                <label>Device/Group Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  placeholder="Enter name..."
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="confirm-btn">Confirm</button>
                <button type="button" className="cancel-btn" onClick={() => setShowGroupModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntercomGroup;
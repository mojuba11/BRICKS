import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IntercomGroup.css";

// ✅ USE LIVE BACKEND
const API_URL = "https://bricks-backend-7wnv.onrender.com/api/intercom";

const IntercomGroup = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FETCH GROUPS
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);

      setGroups(res.data);

      if (res.data.length > 0 && !selectedGroup) {
        setSelectedGroup(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      alert("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD GROUP
  const handleAddGroup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API_URL, {
        name: groupNameInput,
      });

      setGroups([...groups, res.data]);
      setGroupNameInput("");
      setShowGroupModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add group");
    }
  };

  // ✅ DELETE GROUP
  const handleDeleteGroup = async (id, e) => {
    e.stopPropagation();

    if (window.confirm("Delete this intercom group?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);

        setGroups(groups.filter((g) => g._id !== id));

        if (selectedGroup?._id === id) {
          setSelectedGroup(null);
        }
      } catch (err) {
        console.error(err);
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="intercom-container">
      
      {/* LEFT PANE */}
      <div className="left-pane">
        <div className="pane-header">
          <input
            type="text"
            placeholder="Intercom name..."
            className="search-input"
          />
          <button className="add-btn" onClick={() => setShowGroupModal(true)}>
            + Add
          </button>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p>Loading...</p>
          ) : (
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
                      key={group._id}
                      className={
                        selectedGroup?._id === group._id
                          ? "selected-row"
                          : ""
                      }
                      onClick={() => setSelectedGroup(group)}
                    >
                      <td>{group.name}</td>
                      <td>
                        <button
                          className="delete-link"
                          onClick={(e) =>
                            handleDeleteGroup(group._id, e)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="no-data">
                      No groups found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="right-pane">
        <div className="pane-header">
          <h3>
            Members of: {selectedGroup?.name || "Select a group"}
          </h3>
          <button className="add-person-btn">
            + Add personnel
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Department</th>
                <th>Operate</th>
              </tr>
            </thead>

            <tbody>
              {selectedGroup?.members?.length > 0 ? (
                selectedGroup.members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.email}</td>
                    <td>{member.name}</td>
                    <td>{member.dept || "N/A"}</td>
                    <td>
                      <button className="delete-link">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No personnel in this group
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showGroupModal && (
        <div className="modal-overlay">
          <div className="small-modal">
            <div className="modal-header">
              <h3>Add Intercom Group</h3>
              <button
                className="close-x"
                onClick={() => setShowGroupModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddGroup}>
              <div className="form-item">
                <label>Group Name</label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={groupNameInput}
                  onChange={(e) =>
                    setGroupNameInput(e.target.value)
                  }
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="confirm-btn">
                  Confirm
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowGroupModal(false)}
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

export default IntercomGroup;
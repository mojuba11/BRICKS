import React, { useState } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";

function Topbar({ darkMode, setDarkMode }) {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="topbar">
      <h2>Dashboard</h2>

      <div className="top-actions">

        <div className="notification">
          <FaBell onClick={() => setShowNotif(!showNotif)} />
          {showNotif && (
            <div className="notif-dropdown">
              <p>🚨 New SOS Alert</p>
              <p>📹 Live Feed Active</p>
              <p>📂 File Downloaded</p>
            </div>
          )}
        </div>

        <div onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>

      </div>
    </div>
  );
}

export default Topbar;
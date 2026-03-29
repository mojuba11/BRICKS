import React, { useState } from "react";
import { FaBell, FaMoon, FaSun, FaUserShield, FaChevronDown } from "react-icons/fa";
import "./Topbar.css";

function Topbar({ darkMode, setDarkMode }) {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">Command Center</h2>
      </div>

      <div className="top-actions">
        {/* THEME TOGGLE */}
        <div onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn" title="Toggle Mode">
          {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </div>

        {/* NOTIFICATIONS */}
        <div className="notification-wrapper">
          <div className="notif-trigger" onClick={() => setShowNotif(!showNotif)}>
            <FaBell />
            <span className="notif-badge">3</span>
          </div>
          
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">System Alerts</div>
              <div className="notif-item critical">
                <span className="alert-dot"></span>
                <div>
                  <strong>🚨 SOS Alert</strong>
                  <p>Device DEV-004 triggered emergency.</p>
                </div>
              </div>
              <div className="notif-item">
                <span className="info-dot"></span>
                <div>
                  <strong>📹 Live Feed</strong>
                  <p>Operator John is viewing DEV-001.</p>
                </div>
              </div>
              <div className="notif-item">
                <span className="info-dot"></span>
                <div>
                  <strong>📂 File Download</strong>
                  <p>Audit log: Evidence_99.mp4 downloaded.</p>
                </div>
              </div>
              <div className="notif-footer">View All Notifications</div>
            </div>
          )}
        </div>

        {/* USER PROFILE */}
        <div className="user-profile">
          <div className="avatar-circle">
            <FaUserShield />
          </div>
          <div className="user-info">
            <span className="user-name">BRICKS ADMIN</span>
            <span className="user-role">Superuser</span>
          </div>
          <FaChevronDown className="chevron-icon" />
        </div>
      </div>
    </div>
  );
}

export default Topbar;
import React, { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaMap, FaVideo, FaBell,
  FaRoute, FaFileAlt, FaDownload, FaChartBar, FaUsers, FaCogs,
  FaSun, FaMoon, FaTachometerAlt, FaShieldAlt
} from "react-icons/fa";

/* NEW DASHBOARD IMPORT */
import Dashboard from "./pages/command/Dashboard"; 

/* LOGIN PAGE */
import Login from "./pages/login/Login";

/* COMMAND & DISPATCH */
import RealTimeMap from "./pages/command/RealTimeMap";
import LiveVideo from "./pages/command/LiveVideo";
import SOSQuery from "./pages/command/SOSQuery";
import FenceQuery from "./pages/command/FenceQuery";
import HistoryRoute from "./pages/command/HistoryRoute";

/* DOCUMENT */
import FileQuery from "./pages/document/FileQuery";
import DownloadQuery from "./pages/document/DownloadQuery";

/* REPORT */
import UserDataStatistics from "./pages/report/UserDataStatistics";
import TimeStatistics from "./pages/report/TimeStatistics";
import KeyStatistics from "./pages/report/KeyStatistics";
import UserCheckStatistics from "./pages/report/UserCheckStatistics";

/* SYSTEM SETUP */
import Department from "./pages/system/Department";
import UserManagement from "./pages/system/UserManagement";
import DeviceManagement from "./pages/system/DeviceManagement";
import IntercomGroup from "./pages/system/IntercomGroup";
import FenceManagement from "./pages/system/FenceManagement";

function App() {
  const [openMenu, setOpenMenu] = useState("command"); 
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }

  // Tactical Bronze Active Style Logic
  const activeStyle = ({ isActive }) => ({
    color: isActive ? "#c2a078" : "#e0e0e0",
    borderLeft: isActive ? "5px solid #c2a078" : "5px solid transparent",
    backgroundColor: isActive ? "rgba(194, 160, 120, 0.15)" : "transparent",
    fontWeight: isActive ? "900" : "700"
  });

  return (
    <div className={darkMode ? "layout dark" : "layout"}>
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo-section">
            <h1 className="logo-text">
                BRICKS <span className="logo-vms-glow">BODYCAM</span>
            </h1>
            <div className="logo-underline"></div>
        </div>

        {/* SCROLLABLE MENU CONTAINER */}
        <div className="sidebar-menu">
            
            {/* DASHBOARD LINK (ULTRA BOLD) */}
            <NavLink to="/dashboard" className="menu-title-link" style={activeStyle}>
                <div className="menu-single">
                    <FaTachometerAlt /> <span>COMMAND & DASHBOARD</span>
                </div>
            </NavLink>

            {/* COMMAND & DISPATCH */}
            <div className={`menu-title ${openMenu === "command" ? "active-title" : ""}`} onClick={() => toggleMenu("command")}>
                <span>COMMAND & DISPATCH</span>
                {openMenu === "command" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openMenu === "command" && (
                <div className="submenu">
                    <NavLink to="/map" className="submenu-link" style={activeStyle}><FaMap /> Real Time Map</NavLink>
                    <NavLink to="/live-video" className="submenu-link" style={activeStyle}><FaVideo /> Live Video</NavLink>
                    <NavLink to="/sos-query" className="submenu-link" style={activeStyle}><FaBell /> SOS Query</NavLink>
                    <NavLink to="/fence-query" className="submenu-link" style={activeStyle}><FaRoute /> Fence Query</NavLink>
                    <NavLink to="/history-route" className="submenu-link" style={activeStyle}><FaRoute /> History Route</NavLink>
                </div>
            )}

            {/* DOCUMENT */}
            <div className={`menu-title ${openMenu === "document" ? "active-title" : ""}`} onClick={() => toggleMenu("document")}>
                <span>DOCUMENT</span>
                {openMenu === "document" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openMenu === "document" && (
                <div className="submenu">
                    <NavLink to="/file-query" className="submenu-link" style={activeStyle}><FaFileAlt /> File Query</NavLink>
                    <NavLink to="/download-query" className="submenu-link" style={activeStyle}><FaDownload /> Download Query</NavLink>
                </div>
            )}

            {/* REPORT */}
            <div className={`menu-title ${openMenu === "report" ? "active-title" : ""}`} onClick={() => toggleMenu("report")}>
                <span>REPORT</span>
                {openMenu === "report" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openMenu === "report" && (
                <div className="submenu">
                    <NavLink to="/user-data" className="submenu-link" style={activeStyle}><FaChartBar /> User Data Statistics</NavLink>
                    <NavLink to="/key-statistics" className="submenu-link" style={activeStyle}><FaChartBar /> Key Statistics</NavLink>
                    <NavLink to="/time-statistics" className="submenu-link" style={activeStyle}><FaChartBar /> Time Statistics</NavLink>
                    <NavLink to="/user-check" className="submenu-link" style={activeStyle}><FaChartBar /> User Check Statistics</NavLink>
                </div>
            )}

            {/* SYSTEM SETUP (BOLDER & READABLE) */}
            <div className={`menu-title ${openMenu === "system" ? "active-title" : ""}`} onClick={() => toggleMenu("system")}>
                <span>SYSTEM SETUP</span>
                {openMenu === "system" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openMenu === "system" && (
                <div className="submenu">
                    <NavLink to="/department" className="submenu-link" style={activeStyle}><FaUsers /> Department Management</NavLink>
                    <NavLink to="/user-management" className="submenu-link" style={activeStyle}><FaUsers /> User Management</NavLink>
                    <NavLink to="/device-management" className="submenu-link" style={activeStyle}><FaCogs /> Device Management</NavLink>
                    <NavLink to="/intercom-group" className="submenu-link" style={activeStyle}><FaUsers /> Intercom Group</NavLink>
                    <NavLink to="/fence-management" className="submenu-link" style={activeStyle}><FaRoute /> Fence Management</NavLink>
                </div>
            )}
        </div>

        {/* FIXED FOOTER */}
        <div className="sidebar-footer">
            <button className="theme-toggle-btn-tactical" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "LIGHT MODE" : "DARK MODE"}
            </button>
            <button className="logout-btn-tactical" onClick={() => {
                localStorage.removeItem("isAuthenticated");
                setIsAuthenticated(false);
            }}>LOGOUT</button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="main">
        <div className="topbar">
          <h3 style={{color: "#c2a078", fontWeight: "900"}}><FaShieldAlt /> SYSTEM STATUS: OPERATIONAL</h3>
        </div>

        <div className="content-area">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<RealTimeMap />} />
                <Route path="/live-video" element={<LiveVideo />} />
                <Route path="/sos-query" element={<SOSQuery />} />
                <Route path="/fence-query" element={<FenceQuery />} />
                <Route path="/history-route" element={<HistoryRoute />} />
                <Route path="/file-query" element={<FileQuery />} />
                <Route path="/download-query" element={<DownloadQuery />} />
                <Route path="/user-data" element={<UserDataStatistics />} />
                <Route path="/key-statistics" element={<KeyStatistics />} />
                <Route path="/time-statistics" element={<TimeStatistics />} />
                <Route path="/user-check" element={<UserCheckStatistics />} />
                <Route path="/department" element={<Department />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/device-management" element={<DeviceManagement />} />
                <Route path="/intercom-group" element={<IntercomGroup />} />
                <Route path="/fence-management" element={<FenceManagement />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
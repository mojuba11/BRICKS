import React, { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaMap,
  FaVideo,
  FaBell,
  FaRoute,
  FaFileAlt,
  FaDownload,
  FaChartBar,
  FaUsers,
  FaCogs
} from "react-icons/fa";

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
  const [openMenu, setOpenMenu] = useState(null);

  /* ✅ AUTHENTICATION BYPASS */
  // Forced to true so the login screen is skipped
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  /* ✅ LOGIN GUARD REMOVED */
  // If you ever want to turn login back on, just uncomment this:
  /*
  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }
  */

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">BRICKS BODYCAM</h2>

        {/* COMMAND & DISPATCH */}
        <div
          className="menu-title"
          onClick={() => toggleMenu("command")}
        >
          <span>COMMAND & DISPATCH</span>
          {openMenu === "command" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openMenu === "command" && (
          <div className="submenu">
            <NavLink to="/map" className="submenu-link">
              <FaMap /> Real Time Map
            </NavLink>

            <NavLink to="/live-video" className="submenu-link">
              <FaVideo /> Live Video
            </NavLink>

            <NavLink to="/sos-query" className="submenu-link">
              <FaBell /> SOS Query
            </NavLink>

            <NavLink to="/fence-query" className="submenu-link">
              <FaRoute /> Fence Query
            </NavLink>

            <NavLink to="/history-route" className="submenu-link">
              <FaRoute /> History Route
            </NavLink>
          </div>
        )}

        {/* DOCUMENT */}
        <div
          className="menu-title"
          onClick={() => toggleMenu("document")}
        >
          <span>DOCUMENT</span>
          {openMenu === "document" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openMenu === "document" && (
          <div className="submenu">
            <NavLink to="/file-query" className="submenu-link">
              <FaFileAlt /> File Query
            </NavLink>

            <NavLink to="/download-query" className="submenu-link">
              <FaDownload /> Download Query
            </NavLink>
          </div>
        )}

        {/* REPORT */}
        <div
          className="menu-title"
          onClick={() => toggleMenu("report")}
        >
          <span>REPORT</span>
          {openMenu === "report" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openMenu === "report" && (
          <div className="submenu">
            <NavLink to="/user-data" className="submenu-link">
              <FaChartBar /> User Data Statistics
            </NavLink>

            <NavLink to="/key-statistics" className="submenu-link">
              <FaChartBar /> Key Statistics
            </NavLink>

            <NavLink to="/time-statistics" className="submenu-link">
              <FaChartBar /> Time Statistics
            </NavLink>

            <NavLink to="/user-check" className="submenu-link">
              <FaChartBar /> User Check Statistics
            </NavLink>
          </div>
        )}

        {/* SYSTEM SETUP */}
        <div
          className="menu-title"
          onClick={() => toggleMenu("system")}
        >
          <span>SYSTEM SETUP</span>
          {openMenu === "system" ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openMenu === "system" && (
          <div className="submenu">
            <NavLink to="/department" className="submenu-link">
              <FaUsers /> Department Management
            </NavLink>

            <NavLink to="/user-management" className="submenu-link">
              <FaUsers /> User Management
            </NavLink>

            <NavLink to="/device-management" className="submenu-link">
              <FaCogs /> Device Management
            </NavLink>

            <NavLink to="/intercom-group" className="submenu-link">
              <FaUsers /> Intercom Group
            </NavLink>

            <NavLink to="/fence-management" className="submenu-link">
              <FaRoute /> Fence Management
            </NavLink>
          </div>
        )}

        {/* LOGOUT BUTTON */}
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            setIsAuthenticated(false);
          }}
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        <div className="topbar">
          <h3>Command & Dispatch Dashboard</h3>
        </div>

        <Routes>
          {/* ✅ 1. BASE ROUTE - Redirects the main URL to the Map */}
          <Route path="/" element={<Navigate to="/map" replace />} />

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

          {/* ✅ 2. CATCH-ALL ROUTE - If URL is wrong, go back to Map */}
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>

      </div>

    </div>
  );
}

export default App;
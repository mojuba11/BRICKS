import React, { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import {
  FaChevronDown, FaChevronUp, FaMap, FaVideo, FaBell,
  FaRoute, FaFileAlt, FaDownload, FaChartBar, FaUsers, FaCogs
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

  // Check localStorage so users stay logged in if they refresh
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // --- LOGIN GUARD ---
  // If not authenticated, ALWAYS show the Login component
  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">BRICKS BODYCAM</h2>
        
        {/* ... Sidebar Menus (Command, Document, Report, System) ... */}
        {/* (Keep your existing NavLinks here) */}

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("token");
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
          {/* If they are logged in and hit the base URL, send them to /map */}
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<RealTimeMap />} />
          <Route path="/live-video" element={<LiveVideo />} />
          {/* ... Add all your other routes here ... */}
          
          {/* Catch-all for logged-in users */}
          <Route path="*" element={<Navigate to="/map" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
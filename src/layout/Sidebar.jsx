import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaMap,
  FaChartBar,
   FaSearch,
  FaFolderOpen,
  FaHistory,
  FaDownload
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/map?focus=${searchQuery.toUpperCase()}`);
      setSearchQuery("");
    }
  };

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-header">
        {!collapsed && <span className="brand-text">BRICKS <span className="bronze-text">VMS</span></span>}
        <FaBars className="toggle-icon" onClick={() => setCollapsed(!collapsed)} />
      </div>

      {/* TACTICAL SEARCH - Hidden when collapsed */}
      {!collapsed && (
        <form className="sidebar-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search Device..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>
      )}

      <div className="menu-container">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <div className="menu-item">
            <FaTachometerAlt className="menu-icon" /> {!collapsed && "Dashboard"}
          </div>
        </NavLink>

        <NavLink to="/map" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <div className="menu-item">
            <FaMap className="menu-icon" /> {!collapsed && "Tactical Map"}
          </div>
        </NavLink>

        <NavLink to="/file-query" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <div className="menu-item">
            <FaFolderOpen className="menu-icon" /> {!collapsed && "Evidence Vault"}
          </div>
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <div className="menu-item">
            <FaHistory className="menu-icon" /> {!collapsed && "Route History"}
          </div>
        </NavLink>

        <NavLink to="/download-query" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <div className="menu-item">
            <FaDownload className="menu-icon" /> {!collapsed && "Download Logs"}
          </div>
        </NavLink>

        <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <div className="menu-item">
            <FaChartBar className="menu-icon" /> {!collapsed && "Reports"}
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
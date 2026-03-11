import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaMap,
  FaChartBar
} from "react-icons/fa";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-header">
        <span>BRICKS BODYCAM</span>
        <FaBars onClick={() => setCollapsed(!collapsed)} />
      </div>

      <NavLink to="/" end>
        <div className="menu-item">
          <FaTachometerAlt /> {!collapsed && "Dashboard"}
        </div>
      </NavLink>

      <NavLink to="/map">
        <div className="menu-item">
          <FaMap /> {!collapsed && "Real Time Map"}
        </div>
      </NavLink>

      <NavLink to="/stats">
        <div className="menu-item">
          <FaChartBar /> {!collapsed && "Reports"}
        </div>
      </NavLink>
    </div>
  );
}

export default Sidebar;
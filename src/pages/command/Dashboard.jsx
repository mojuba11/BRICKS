import React from "react";
import { FaUsers, FaBroadcastTower, FaFileDownload, FaExclamationTriangle } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="tactical-dashboard">
      <div className="kpi-grid">
        <div className="kpi-card">
          <FaUsers className="kpi-icon" />
          <div className="kpi-info"><h3>5</h3><p>Total Users</p></div>
        </div>
        <div className="kpi-card active-feed">
          <FaBroadcastTower className="kpi-icon" />
          <div className="kpi-info"><h3>5</h3><p>Live Feeds</p></div>
        </div>
        <div className="kpi-card">
          <FaFileDownload className="kpi-icon" />
          <div className="kpi-info"><h3>10</h3><p>Downloads</p></div>
        </div>
        <div className="kpi-card alert-active">
          <FaExclamationTriangle className="kpi-icon" />
          <div className="kpi-info"><h3>5</h3><p>Active Alerts</p></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
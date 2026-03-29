import React from "react";
import { 
  FaMapMarkedAlt, FaShieldAlt, FaHistory, 
  FaFileDownload, FaChartLine, FaBroadcastTower 
} from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="tactical-dashboard">
      <header className="dashboard-header">
        <h1>DISPATCH & <span className="bronze-text">COMMAND</span></h1>
        <div className="system-status">
          <span className="pulse-dot"></span> SYSTEM OPERATIONAL
        </div>
      </header>

      {/* TACTICAL METRICS GRID */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><FaShieldAlt /></div>
          <div className="kpi-data">
            <h3>1,245</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="kpi-card active-feed">
          <div className="kpi-icon"><FaBroadcastTower /></div>
          <div className="kpi-data">
            <h3>38</h3>
            <p>Live Feeds</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaFileDownload /></div>
          <div className="kpi-data">
            <h3>5,872</h3>
            <p>Files Downloaded</p>
          </div>
        </div>
        <div className="kpi-card alert-active">
          <div className="kpi-icon"><FaChartLine /></div>
          <div className="kpi-data">
            <h3>12</h3>
            <p>Active Alerts</p>
          </div>
        </div>
      </div>

      {/* MODULE QUICK-ACCESS SECTION */}
      <div className="tactical-modules-grid">
        
        <div className="module-box">
          <div className="module-header"><FaMapMarkedAlt /> Tactical Map</div>
          <p>Real-time tracking and Geofencing drawing enabled.</p>
          <div className="status-tag">6 Units Tracked</div>
        </div>

        <div className="module-box">
          <div className="module-header"><FaShieldAlt /> Evidence Vault</div>
          <p>Secure video/photo query with HD modal playback.</p>
          <div className="status-tag">Encryption Active</div>
        </div>

        <div className="module-box">
          <div className="module-header"><FaHistory /> Historical Route</div>
          <p>Trace past movements with interactive playback slider.</p>
          <div className="status-tag">Logs: 30 Days</div>
        </div>

        <div className="module-box">
          <div className="module-header"><FaFileDownload /> Audit Logs</div>
          <p>Comprehensive download query tracking and logs.</p>
          <div className="status-tag">Verified</div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
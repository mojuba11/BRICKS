import React from "react";

function Dashboard() {
  return (
    <div className="kpi-grid">
      <div className="kpi-card"><h3>1,245</h3><p>Total Users</p></div>
      <div className="kpi-card"><h3>38</h3><p>Live Feeds</p></div>
      <div className="kpi-card"><h3>5,872</h3><p>Files Downloaded</p></div>
      <div className="kpi-card"><h3>12</h3><p>Active Alerts</p></div>
    </div>
  );
}

export default Dashboard;
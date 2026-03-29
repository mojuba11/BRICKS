import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import "./MainLayout.css";

export default function MainLayout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app-container ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* Sidebar stays on the left */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="main-wrapper">
        <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main className="content-area">
          <Outlet context={[darkMode]} />
        </main>
      </div>
    </div>
  );
}
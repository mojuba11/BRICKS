import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
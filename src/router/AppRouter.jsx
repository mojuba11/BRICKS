import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Placeholder from "../pages/Placeholder";

// COMMAND
import RealTimeMap from "../pages/command/RealTimeMap";
import LiveVideo from "../pages/command/LiveVideo";
import SOSQuery from "../pages/command/SOSQuery";
import FenceQuery from "../pages/command/FenceQuery";
import HistoryRoute from "../pages/command/HistoryRoute";

// DOCUMENT
import FileQuery from "../pages/document/FileQuery";
import DownloadQuery from "../pages/document/DownloadQuery";

// REPORT
import UserData from "../pages/report/UserData";
import KeyStatistics from "../pages/report/KeyStatistics";
import TimeStatistics from "../pages/report/TimeStatistics";
import UserCheck from "../pages/report/UserCheck";

// SYSTEM
import Department from "../pages/system/Department";
import UserManagement from "../pages/system/UserManagement";
import DeviceManagement from "../pages/system/DeviceManagement";
import IntercomGroup from "../pages/system/IntercomGroup";
import FenceManagement from "../pages/system/FenceManagement";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          {/* COMMAND & DISPATCH */}
          <Route path="real-time-map" element={<RealTimeMap />} />
          <Route path="live-video" element={<LiveVideo />} />
          <Route path="sos-query" element={<SOSQuery />} />
          <Route path="fence-query" element={<FenceQuery />} />
          <Route path="history-route" element={<HistoryRoute />} />

          {/* DOCUMENT */}
          <Route path="file-query" element={<FileQuery />} />
          <Route path="download-query" element={<DownloadQuery />} />

          {/* REPORT */}
          <Route path="user-data" element={<UserData />} />
          <Route path="key-stat" element={<KeyStatistics />} />
          <Route path="time-stat" element={<TimeStatistics />} />
          <Route path="user-check" element={<UserCheck />} />

          {/* SYSTEM SETUP */}
          <Route path="department" element={<Department />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="device-management" element={<DeviceManagement />} />
          <Route path="intercom-group" element={<IntercomGroup />} />
          <Route path="fence-management" element={<FenceManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Login, Register, ForgotPassword, VerifyCode } from "./components/auth";
import Dashboard    from "./components/pages/Dashboard";
import NotFound     from "./components/pages/NotFound";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import MonitorDashboard from "./components/dashboard/MonitorDashboard";
import NewMonitor       from "./components/dashboard/NewMonitor";
import EditMonitor      from "./components/dashboard/EditMonitor";
import MonitorDetail    from "./components/dashboard/MonitorDetail";
import Integrations     from "./components/dashboard/Integrations";
import UserProfile      from "./components/dashboard/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email"    element={<VerifyCode />} />

        {/* Dashboard (layout com sidebar) */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index                  element={<MonitorDashboard />} />
            <Route path="monitors/new"      element={<NewMonitor />} />
            <Route path="monitors/:id"      element={<MonitorDetail />} />
            <Route path="monitors/:id/edit" element={<EditMonitor />} />
            <Route path="integrations"    element={<Integrations />} />
            <Route path="profile"         element={<UserProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster richColors position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./app/routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/auth/Unauthorized";
import Locked from "./pages/auth/Locked";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminServices from "./pages/admin/Services";
import AdminAppointments from "./pages/admin/Appointments";
import AdminUsers from "./pages/admin/Users";
import UserHome from "./pages/user/Home";
import MyAppointments from "./pages/user/MyAppointments";
import UserProfile from "./pages/user/Profile";
import AdminProfile from "./pages/admin/Profile";
import { useTheme } from "./app/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <BrowserRouter>
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center fixed bottom-5 right-5 z-50 w-12 h-12 bg-white dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700/50 group active:scale-95"
        title="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        ) : (
          <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/locked" element={<Locked />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute role="admin">
              <AdminServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute role="admin">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

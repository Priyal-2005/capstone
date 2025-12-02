import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import UpcomingAppointments from "./pages/patient/UpcomingAppointments";
import PastAppointments from "./pages/patient/PastAppointments";
import AllDoctors from "./pages/patient/AllDoctors";

import DoctorAppointments from "./pages/doctor/DoctorAppointments";

import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageAppointments from "./pages/admin/ManageAppointments";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/upcoming"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <UpcomingAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/past"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PastAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <AllDoctors />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-appointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageAppointments />
            </ProtectedRoute>
          }
        />
        
        
        {/* Fallback ROute */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import UpcomingAppointments from "./pages/patient/UpcomingAppointments";
import PastAppointments from "./pages/patient/PastAppointments";
import AllDoctors from "./pages/patient/AllDoctors";

import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorUpcoming from "./pages/doctor/DoctorUpcoming";

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
              <Layout>
                <PatientDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/upcoming"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <Layout>
                <UpcomingAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/past"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <Layout>
                <PastAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <Layout>
                <AllDoctors />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <Layout>
                <DoctorAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/upcoming"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <Layout>
                <DoctorUpcoming />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-doctors"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <ManageDoctors />
              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-appointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Layout>
                <ManageAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        
        {/* Fallback ROute */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
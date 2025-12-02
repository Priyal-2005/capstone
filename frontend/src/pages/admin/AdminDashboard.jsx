import React from "react";
import "../../styles/admin.css";
import axios from "axios";

export default function AdminDashboard() {
  const logout = async () => {
    await axios.post("/auth/logout");
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      <div className="admin-topbar">
        <strong>Welcome, {localStorage.getItem("name")}</strong>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="admin-nav">
        <button onClick={() => (window.location.href = "/admin/manage-doctors")}>
          Manage Doctors
        </button>

        <button onClick={() => (window.location.href = "/admin/manage-appointments")}>
          Manage Appointments
        </button>
      </div>
    </div>
  );
}

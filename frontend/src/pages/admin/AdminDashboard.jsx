import React from "react";
import "../../styles/admin.css";

export default function AdminDashboard() {
  const logout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include"
    });
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

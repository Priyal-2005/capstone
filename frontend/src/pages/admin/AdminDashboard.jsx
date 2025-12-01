import React from "react";

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
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: 20 }}>
        <strong>Welcome, {localStorage.getItem("name")}</strong>
        <button onClick={logout} style={{ marginLeft: 15 }}>Logout</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => (window.location.href = "/admin/manage-doctors")}>Manage Doctors</button>
        <button onClick={() => (window.location.href = "/admin/manage-appointments")}>Manage Appointments</button>
      </div>
    </div>
  );
}

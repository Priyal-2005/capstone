import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/doctor.css";

export default function DoctorDashboard() {
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [todayRes, upcomingRes] = await Promise.all([
        axios.get("/doctor/appointments/today"),
        axios.get("/doctor/appointments/upcoming")
      ]);

      setToday(todayRes.data.data || []);
      setUpcoming(upcomingRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  const logout = async () => {
    await axios.post("/auth/logout");
    localStorage.clear();
    window.location.href = "/login";
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.put("/doctor/appointments/status", {
        appointmentId,
        status,
      });

      alert("Status updated");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status");
    }
  };

  if (loading) return <div className="doctor-container">Loading...</div>;

  return (
    <div className="doctor-container">
      <h2 className="doctor-title">Doctor Dashboard</h2>

      <div className="doctor-topbar">
        <strong>Welcome, Dr. {localStorage.getItem("name")}</strong>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="doctor-nav">
      <button onClick={() => (window.location.href = "/doctor/upcoming")}>Upcoming Appointments</button>
      <button onClick={() => (window.location.href = "/doctor/appointments")}>
        All Appointments
      </button>
      </div>


      {/* Today's Appointments */}
      <h3>Today's Appointments</h3>
      {today.length === 0 ? (
        <p>No appointments for today.</p>
      ) : (
        today.map((a) => (
          <div key={a.id} className="doc-card">
            <div className="doc-card-title">Patient: {a.patient.name}</div>

            <div className="doc-info">
              <strong>Time:</strong> {new Date(a.dateTime).toLocaleString()}
            </div>

            <div className="doc-info">
              <strong>Status:</strong>{" "}
              <span className={`status-${a.status.toLowerCase()}`}>
                {a.status}
              </span>
            </div>

            {a.status === "PENDING" && (
              <div style={{ marginTop: 10 }}>
                <button
                  className="action-btn action-approve"
                  onClick={() => updateStatus(a.id, "APPROVED")}
                >
                  Approve
                </button>

                <button
                  className="action-btn action-decline"
                  onClick={() => updateStatus(a.id, "DECLINED")}
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}


      {/* Upcoming Appointments */}
      <h3 style={{ marginTop: 30 }}>Upcoming Appointments</h3>
      {upcoming.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        upcoming.map((a) => (
          <div key={a.id} className="doc-card">
            <div className="doc-card-title">Patient: {a.patient.name}</div>

            <div className="doc-info">
              <strong>Date:</strong> {new Date(a.dateTime).toLocaleString()}
            </div>

            <div className="doc-info">
              <strong>Status:</strong>{" "}
              <span className={`status-${a.status.toLowerCase()}`}>
                {a.status}
              </span>
            </div>

            {a.status === "PENDING" && (
              <div style={{ marginTop: 10 }}>
                <button
                  className="action-btn action-approve"
                  onClick={() => updateStatus(a.id, "APPROVED")}
                >
                  Approve
                </button>

                <button
                  className="action-btn action-decline"
                  onClick={() => updateStatus(a.id, "DECLINED")}
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/patient.css";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/appointments/upcoming")
      .then((res) => {
        setAppointments(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Could not load upcoming appointments");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className="page-container">
      <h2 className="page-title">Upcoming Appointments</h2>

      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <div>
          {appointments.map((a) => (
            <div key={a.id} className="card">
              <div className="appointment-title">
                Dr. {a.doctor.user.name}
              </div>

              <div className="info-row">
                <strong>Date:</strong> {new Date(a.dateTime).toLocaleString()}
              </div>

              <div className="info-row">
                <strong>Status:</strong>
                {a.status === "APPROVED" && (
                  <span className="status-badge status-approved">Approved</span>
                )}
                {a.status === "PENDING" && (
                  <span className="status-badge status-pending">Pending</span>
                )}
                {a.status === "DECLINED" && (
                  <span className="status-badge status-declined">Declined</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="primary-btn"
        onClick={() => (window.location.href = "/patient")}
        style={{ marginTop: 20 }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
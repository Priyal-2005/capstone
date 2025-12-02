import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin.css";

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/appointments");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadAppointments();
    })();
  }, []);

  const handleDeleteAppointment = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await axios.delete(`/admin/appointments/${id}`);
      alert("Appointment deleted successfully");
      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting appointment");
    }
  };

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      <h2 className="admin-title">Manage Appointments</h2>

      <div className="admin-nav">
        <button onClick={() => (window.location.href = "/admin")}>
          Back to Dashboard
        </button>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id} className="admin-card">
            <div className="info-row">
              <strong>Patient:</strong> {a.patient.name}
            </div>
            <div className="info-row">
              <strong>Doctor:</strong> {a.doctor.user.name}
            </div>
            <div className="info-row">
              <strong>Date:</strong> {new Date(a.dateTime).toLocaleString()}
            </div>
            <div className="info-row">
              <strong>Status:</strong> {a.status}
            </div>

            <button
              className="delete-btn"
              style={{ marginTop: 10 }}
              onClick={() => handleDeleteAppointment(a.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
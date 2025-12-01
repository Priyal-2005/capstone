import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = () => {
    setLoading(true);
    axios
      .get("/admin/appointments")
      .then((res) => setAppointments(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
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

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id} style={{ marginBottom: 15 }}>
              <strong>Patient:</strong> {a.patient.name} <br />
              <strong>Doctor:</strong> {a.doctor.user.name} <br />
              <strong>Date:</strong> {new Date(a.dateTime).toLocaleString()} <br />
              <strong>Status:</strong> {a.status}

              <div style={{ marginTop: 5 }}>
                <button
                  onClick={() => handleDeleteAppointment(a.id)}
                  style={{ background: "red", color: "white" }}
                >
                  Delete
                </button>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => (window.location.href = "/admin")}
        style={{ marginTop: 20 }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
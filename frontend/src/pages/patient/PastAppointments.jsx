import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function PastAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/appointments/past")
      .then((res) => {
        setAppointments(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Could not load past appointments");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Past Appointments</h2>

      {appointments.length === 0 ? (
        <p>No past appointments.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>
              <strong>Doctor:</strong> {a.doctor.user.name}
              <br />
              <strong>Date:</strong> {new Date(a.dateTime).toLocaleString()}
              <br />
              <strong>Status:</strong> {a.status}
              <hr />
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => window.location.href = "/patient"} style={{ marginTop: 20 }}>
        Back to Dashboard
      </button>
    </div>
  );
}
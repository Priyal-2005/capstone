import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

// today's appointements + upcoming appointments + approve/decline + status update

export default function DoctorAppointments() {
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);

    axios.get("/doctor/appointments/today")
      .then(res => setToday(res.data.data))
      .catch(err => console.error(err));

    axios.get("/doctor/appointments/upcoming")
      .then(res => setUpcoming(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.put("/doctor/appointments/status", {
        appointmentId,
        status
      });

      alert("Status updated");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Appointments</h2>

      <h3>Today's Appointments</h3>
      {today.length === 0 ? (
        <p>No appointments today.</p>
      ) : (
        <ul>
          {today.map(a => (
            <li key={a.id} style={{ marginBottom: 10 }}>
              <strong>Patient:</strong> {a.patient.name} <br />
              <strong>Time:</strong> {new Date(a.dateTime).toLocaleString()} <br />
              <strong>Status:</strong> {a.status} <br />

              {a.status === "PENDING" && (
                <div style={{ marginTop: 5 }}>
                  <button onClick={() => updateStatus(a.id, "APPROVED")}>Approve</button>
                  <button 
                    onClick={() => updateStatus(a.id, "DECLINED")}
                    style={{ marginLeft: 10 }}
                  >
                    Decline
                  </button>
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: 30 }}>Upcoming Appointments</h3>
      {upcoming.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul>
          {upcoming.map(a => (
            <li key={a.id} style={{ marginBottom: 10 }}>
              <strong>Patient:</strong> {a.patient.name} <br />
              <strong>Date:</strong> {new Date(a.dateTime).toLocaleString()} <br />
              <strong>Status:</strong> {a.status}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
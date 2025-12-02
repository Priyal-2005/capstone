import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/doctor.css";

axios.defaults.withCredentials = true;

export default function DoctorUpcoming() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    axios
      .get("/doctor/appointments/upcoming")
      .then((res) => {
        setAppointments(res.data.data);
        setFiltered(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (appointmentId, status) => {
    try {
      await axios.put("/doctor/appointments/status", {
        appointmentId,
        status,
      });
      alert("Status updated");

      // Refresh list
      const refreshed = await axios.get("/doctor/appointments/upcoming");
      setAppointments(refreshed.data.data);
      applyFilter(statusFilter, refreshed.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    }
  };

  const applyFilter = (filter, data = appointments) => {
    setStatusFilter(filter);

    if (filter === "ALL") {
      setFiltered(data);
    } else {
      setFiltered(data.filter((a) => a.status === filter));
    }
  };

  return (
    <div className="doctor-container">
      <h2 className="doctor-title">Upcoming Appointments</h2>

      {/* navigation */}
      <div className="doctor-nav">
        <button onClick={() => (window.location.href = "/doctor")}>
          Back to Dashboard
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="doctor-nav" style={{ marginBottom: 20 }}>
        <button onClick={() => applyFilter("ALL")}>All</button>
        <button onClick={() => applyFilter("PENDING")}>Pending</button>
        <button onClick={() => applyFilter("APPROVED")}>Approved</button>
        <button onClick={() => applyFilter("DECLINED")}>Declined</button>
      </div>

      {/* APPOINTMENTS LIST */}
      {filtered.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        filtered.map((a) => (
          <div className="doc-card" key={a.id}>
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

            {/* Pending → allow Approve / Decline */}
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
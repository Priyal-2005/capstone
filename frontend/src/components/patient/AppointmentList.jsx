import "../styles/patient.css";

export default function AppointmentList({ appointments }) {
  if (!appointments || appointments.length === 0) {
    return <p>No appointments found.</p>;
  }

  return (
    <div>
      {appointments.map(a => (
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
  );
}
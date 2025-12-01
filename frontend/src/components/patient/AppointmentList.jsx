export default function AppointmentList({ appointments }) {
    return (
      <div>
        <h3>Your Upcoming Appointments</h3>
  
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <ul>
            {appointments.map(a => (
              <li key={a.id}>
                <strong>Doctor:</strong> {a.doctor.user.name}  
                <strong> | Date:</strong> {new Date(a.dateTime).toLocaleString()}
                <strong> | Status:</strong> {a.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}
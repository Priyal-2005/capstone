export default function DoctorList({ doctors, onBook }) {
    return (
      <div>
        <h3>Doctors</h3>
        <ul>
          {doctors.map(d => (
            <li key={d.id}>
              {d.user.name} — {d.specialization}
              <button 
                style={{ marginLeft: 10 }}
                onClick={() => onBook(d)}
              >
                Book
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
}
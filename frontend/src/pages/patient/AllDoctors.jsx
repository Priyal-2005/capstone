import { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "../../components/patient/BookingForm";
import "../../styles/patient.css";

axios.defaults.withCredentials = true;

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const limit = 5;

  const loadDoctors = () => {
    axios.get("/doctors", {
      params: { search, specialization, page, limit }
    }).then(res => {
      setDoctors(res.data.data);
      setTotal(res.data.total);
    });
  };

  useEffect(() => { loadDoctors(); }, [page, search, specialization]);

  return (
    <div className="page-container">
      <h2>Doctors</h2>

      <div className="nav-buttons">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <select
          value={specialization}
          onChange={(e) => { setSpecialization(e.target.value); setPage(1); }}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="">All</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurologist
          </option>
          <option value="Oncologist">Oncologist</option>
          <option value="Gynecologist">Gynecologist</option>
        </select>
      </div>

      {doctors.map(doc => (
        <div key={doc.id} className="card">
          <div className="appointment-title">{doc.user.name}</div>
          <div className="info-row"><strong>{doc.specialization}</strong></div>

          <button
            className="primary-btn"
            onClick={() => setSelectedDoctor(doc)}
          >
            Book
          </button>
        </div>
      ))}

      {/* PAGINATION BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginTop: 20 }}>
        <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="primary-btn"
        >
          Prev
        </button>

        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
          className="primary-btn"
        >
          Next
        </button>
      </div>

{selectedDoctor && (
  <BookingForm
    doctor={selectedDoctor}
    onCancel={() => setSelectedDoctor(null)}
    onSubmit={async (date, time) => {
      try {
        const dateTime = new Date(`${date}T${time}:00`).toISOString();

        await axios.post("/appointments/book", {
          doctorId: selectedDoctor.id,
          dateTime
        });

        alert("Appointment successfully booked!");

        setSelectedDoctor(null);

      } catch (err) {
        console.error(err);

        if (err.response?.data?.message?.includes("slot")) {
          alert("This time slot is already booked");
        } else {
          alert("There was a problem booking your appointment");
        }
      }
    }}
  />
)}
    </div>
  );
}
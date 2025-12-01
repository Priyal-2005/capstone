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
          <option value="Neurology">Neurology</option>
          <option value="Pediatrics">Pediatrics</option>
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

      {selectedDoctor && (
        <BookingForm
          doctor={selectedDoctor}
          onCancel={() => setSelectedDoctor(null)}
          onSubmit={(date, time) => {}}
        />
      )}
    </div>
  );
}
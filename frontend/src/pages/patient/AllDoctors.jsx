import { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "../../components/patient/BookingForm";

axios.defaults.withCredentials = true;

export default function AllDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const limit = 5;

  const fetchDoctors = () => {
    axios
      .get("/doctors", {
        params: {
          search,
          specialization,
          page,
          limit
        }
      })
      .then((res) => {
        setDoctors(res.data.data);
        setTotal(res.data.total); // backend gives total doctors count
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, search, specialization]);

  // Booking handler
  const handleBooking = async (date, time) => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    const dateTime = new Date(`${date}T${time}:00`).toISOString();

    try {
      await axios.post("/appointments/book", {
        doctorId: selectedDoctor.id,
        dateTime
      });

      alert("Appointment booked!");
      setSelectedDoctor(null);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>All Doctors</h2>

      {/* Search + Filter Section */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ marginRight: 10 }}
        />

        <select
          value={specialization}
          onChange={(e) => {
            setSpecialization(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Specializations</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Neurology">Neurology</option>
        </select>
      </div>

      {/* Doctors List */}
      <ul>
        {doctors.map((d) => (
          <li key={d.id} style={{ marginBottom: 10 }}>
            <strong>{d.user.name}</strong> — {d.specialization}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => setSelectedDoctor(d)}
            >
              Book
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div style={{ marginTop: 20 }}>
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page}
        </span>

        <button 
          disabled={page * limit >= total} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Booking Form */}
      {selectedDoctor && (
        <BookingForm
          doctor={selectedDoctor}
          onSubmit={handleBooking}
          onCancel={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}
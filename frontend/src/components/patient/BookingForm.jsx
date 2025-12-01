import { useState } from "react";
import "../../styles/patient.css";

export default function BookingForm({ doctor, onSubmit, onCancel }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div className="card" style={{ width: 320 }}>
      <h3 className="appointment-title">Book Appointment</h3>
      <div className="info-row">
        <strong>Doctor:</strong> {doctor.user.name}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(date, time);
        }}
      >
        <div className="info-row">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              marginTop: 5,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
              width: "100%"
            }}
          />
        </div>

        <div className="info-row" style={{ marginTop: 10 }}>
          <label>Select Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{
              marginTop: 5,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
              width: "100%"
            }}
          />
        </div>

        <button
          type="submit"
          className="primary-btn"
          style={{ marginTop: 15, width: "100%" }}
        >
          Confirm Booking
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="primary-btn"
          style={{
            marginTop: 10,
            background: "#e74a3b",
            width: "100%"
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
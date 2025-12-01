import { useState } from "react";

export default function BookingForm({ doctor, onSubmit, onCancel }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <div style={{
      border: "1px solid black",
      padding: 20,
      marginTop: 20,
      width: 300
    }}>
      <h3>Book Appointment</h3>
      <p>Doctor: <strong>{doctor.user.name}</strong></p>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(date, time);
      }}>
        <div>
          <label>Select Date:</label><br />
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Select Time:</label><br />
          <input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)} 
          />
        </div>

        <button type="submit" style={{ marginTop: 15 }}>
          Confirm Booking
        </button>

        <button 
          type="button"
          onClick={onCancel}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
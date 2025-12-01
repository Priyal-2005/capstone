import { useEffect, useState } from "react";
import axios from "axios";
import AppointmentList from "../../components/patient/AppointmentList";
import "../../styles/patient.css";

axios.defaults.withCredentials = true;

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("/appointments/upcoming").then(res => setAppointments(res.data.data));
  }, []);

  const logout = async () => {
    await axios.post("/auth/logout");
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="page-container">
      <div className="page-title">Welcome, {localStorage.getItem("name")}</div>

      <div className="nav-buttons">
        <button onClick={() => window.location.href = "/patient/upcoming"}>Upcoming</button>
        <button onClick={() => window.location.href = "/patient/past"}>Past</button>
        <button onClick={() => window.location.href = "/patient/doctors"}>Doctors</button>
        <button onClick={logout}>Logout</button>
      </div>

      <h3>Upcoming Appointments</h3>
      <AppointmentList appointments={appointments} />
    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";
import AppointmentList from "../components/patient/AppointmentList";

axios.defaults.withCredentials = true;

// upcoming appointments + logout + navigation

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
    <div style={{ padding: 20 }}>
      <h2>Welcome, {localStorage.getItem("name")}</h2>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => window.location.href = "/patient/upcoming"}>Upcoming</button>
        <button onClick={() => window.location.href = "/patient/past"} style={{ marginLeft: 10 }}>Past Appointments</button>
        <button onClick={() => window.location.href = "/patient/doctors"} style={{ marginLeft: 10 }}>See All Doctors</button>
        <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
      </div>

      <AppointmentList appointments={appointments} />

    </div>
  );
}
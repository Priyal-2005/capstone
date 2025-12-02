const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
// Allow cookies from frontend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
// register + login
app.use("/auth", require("./routes/auth.routes"));

// logged in user
app.use("/user", require("./routes/user.routes"));

// list doctors
app.use("/doctors", require("./routes/doctor.routes"));

// book, get upcoming, past appointments
app.use("/appointments", require("./routes/appointment.routes"));

// today, upcoming, approve/decline appointments for doctor
app.use("/doctor/appointments", require("./routes/doctor.appointment.routes"));

// doctor profile
app.use("/doctor/profile", require("./routes/doctor.profile.routes"));

// doctor availability
app.use("/doctor/availability", require("./routes/doctor.availability.routes"));

// admin routes
app.use("/admin", require("./routes/admin.routes"));

app.listen(8000, () => console.log("Running on http://localhost:8000"));
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
// Allow cookies from frontend
app.use(cors({
  origin: ["http://localhost:5173", "https://capstone-seven-liart.vercel.app", "https://capstone-git-main-priyal-2005s-projects.vercel.app", "https://capstone-owweb0nwg-priyal-2005s-projects.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());

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

// admin routes
app.use("/admin", require("./routes/admin.routes"));

app.listen(8000, () => console.log("Running on http://localhost:8000"));
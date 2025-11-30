const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/doctors", require("./routes/doctor.routes"));
app.use("/appointments", require("./routes/appointment.routes"));
app.use("/doctor/appointments", require("./routes/doctor.appointment.routes"));

app.listen(8000, () => console.log("Running on http://localhost:8000"));
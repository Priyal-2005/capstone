const router = require("express").Router();
const isAuth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");
const doctor = require("../controllers/doctor.appointment.controller");

router.use(isAuth, allowRoles("DOCTOR"));

router.get("/today", doctor.getTodayAppointments);
router.get("/upcoming", doctor.getUpcomingAppointments);
router.put("/status", doctor.updateAppointmentStatus);

module.exports = router;
const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
const {
    getTodayAppointments,
    getUpcomingAppointments,
    updateAppointmentStatus
} = require("../controllers/doctor.appointment.controller");

router.use(isAuth, allowRoles("DOCTOR"));

router.get("/today", getTodayAppointments);
router.get("/upcoming", getUpcomingAppointments);
router.put("/status", updateAppointmentStatus);

module.exports = router;
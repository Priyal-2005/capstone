const router = require("express").Router();
const isAuth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");
const {
    bookAppointment,
    upcomingAppointments,
    pastAppointments
} = require("../controllers/appointment.controller");

router.post("/book", isAuth, allowRoles("PATIENT"), bookAppointment);
router.get("/upcoming", isAuth, allowRoles("PATIENT"), upcomingAppointments);
router.get("/past", isAuth, allowRoles("PATIENT"), pastAppointments);

module.exports = router;
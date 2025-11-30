const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
const admin = require("../controllers/admin.controller");

router.use(isAuth, allowRoles("ADMIN"));

router.post("/doctors", admin.createDoctor);
router.get("/doctors", admin.getAllDoctors);
router.put("/doctors/:id", admin.updateDoctor);
router.delete("/doctors/:id", admin.deleteDoctor);

router.get("/appointments", admin.getAllAppointments);

module.exports = router;
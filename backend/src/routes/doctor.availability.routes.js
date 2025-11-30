const router = require("express").Router();
const isAuth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");
const availability = require("../controllers/doctor.availability.controller");

router.use(isAuth, allowRoles("DOCTOR"));

router.post("/", availability.addAvailability);
router.get("/", availability.getAvailability);
router.delete("/:id", availability.deleteAvailability);

module.exports = router;
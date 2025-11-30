const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");
const doctorProfile = require("../controllers/doctor.profile.controller");

router.use(isAuth, allowRoles("DOCTOR"));

router.get("/", doctorProfile.getDoctorProfile);
router.post("/", doctorProfile.createDoctorProfile);
router.put("/", doctorProfile.updateDoctorProfile);

module.exports = router;
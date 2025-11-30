const router = require("express").Router();
const {isAuth} = require("../middlewares/auth");
const { getDoctorList, getDoctorById } = require("../controllers/doctor.controller");

router.get("/", isAuth, getDoctorList);
router.get("/:id", isAuth, getDoctorById);

module.exports = router;
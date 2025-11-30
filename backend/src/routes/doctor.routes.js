const router = require("express").Router();
const isAuth = require("../middlewares/auth");
const { listDoctors, getDoctor } = require("../controllers/doctor.controller");

router.get("/", isAuth, listDoctors);
router.get("/:id", isAuth, getDoctor);

module.exports = router;
const router = require("express").Router();
const {register, login} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", authController.refresh);

module.exports = router;
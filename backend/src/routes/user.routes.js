const router = require("express").Router();
const {isAuth} = require("../middlewares/auth");
const {getUser} = require("../controllers/user.controller");

router.get("/", isAuth, getUser);

module.exports = router;
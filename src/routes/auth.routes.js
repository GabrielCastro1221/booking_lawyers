const { Router } = require("express");
const AuthController = require("../controllers/auth.controller");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const auth = new AuthController();

router.post("/register", upload.single('photo'), auth.register);
router.post("/login", auth.login);

module.exports = router;
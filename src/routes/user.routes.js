const { Router } = require("express");
const UserController = require("../controllers/user.controller");
const upload = require("../middlewares/upload.middleware");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");

const router = Router();
const user = new UserController();
const auth = new AuthMiddleware();

router.post(
  "/create-appointment",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.createAppointment
);
router.get("/", auth.authenticate, auth.restrict(["admin"]), user.getAllUsers);
router.get(
  "/:id",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.getUserById
);
router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.getUserProfile
);
router.put(
  "/:id",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  upload.single("photo"),
  user.updateUser
);
router.put(
  "/cancelled/:id",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.cancelledAppointment
);
router.put(
  "/admin/:id",
  auth.authenticate,
  auth.restrict(["admin"]),
  user.changeRolAdmin
);
router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["usuario", "admin"]),
  user.deleteUser
);

module.exports = router;

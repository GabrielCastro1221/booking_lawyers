const { Router } = require("express");
const LawyerController = require("../controllers/lawyer.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");
const upload = require("../middlewares/upload.middleware");

const router = Router();
const lawyer = new LawyerController();
const auth = new AuthMiddleware();

router.get("/", lawyer.getAllLawyers);
router.get("/:id", lawyer.getLawyerById);
router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["abogado"]),
  lawyer.getLawyerProfile
);
router.put(
  "/:id",
  auth.authenticate,
  auth.restrict(["abogado", "admin"]),
  upload.single("photo"),
  lawyer.updateLawyer
);
router.put(
  "/approved/:id",
  auth.authenticate,
  auth.restrict(["abogado"]),
  lawyer.changeStatusAppointment
);
router.put(
  "/:id/approval-status",
  auth.authenticate,
  auth.restrict(["admin"]),
  lawyer.changeApprovalStatus
);
router.put(
  "/:id/cancelled-status",
  auth.authenticate,
  auth.restrict(["admin"]),
  lawyer.cancelledStatus
);
router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["abogado", "admin"]),
  lawyer.deleteLawyer
);

module.exports = router;

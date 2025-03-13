const { Router } = require("express");
const BookingController = require("../controllers/booking.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");

const router = Router();
const booking = new BookingController();
const auth = new AuthMiddleware();

router.get(
  "/",
  auth.authenticate,
  auth.restrict(["admin"]),
  booking.getAllBookings
);
router.get("/:id", booking.getBookingById);
router.put(
  "/:id",
  auth.authenticate,
  auth.restrict(["abogado", "admin"]),
  booking.updateBooking
);
router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["abogado", "admin"]),
  booking.deleteBooking
);

module.exports = router;

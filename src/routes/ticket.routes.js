const { Router } = require("express");
const TicketController = require("../controllers/ticket.controller");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");

const router = Router();
const ticket = new TicketController();
const auth = new AuthMiddleware();

router.get(
  "/",
  auth.authenticate,
  auth.restrict(["admin"]),
  ticket.getAllTickets
);
router.get("/:id", ticket.getTicketById);
router.put(
  "/:id",
  auth.authenticate,
  auth.restrict(["abogado", "admin"]),
  ticket.updateTicket
);
router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["abogado", "admin"]),
  ticket.deleteTicket
);

module.exports = router;

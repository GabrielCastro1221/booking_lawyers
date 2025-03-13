const viewsRouter = require("../routes/views.routes");
const authRouter = require("../routes/auth.routes");
const uploadRouter = require("../routes/upload.routes");
const userRouter = require("../routes/user.routes");
const lawyerRouter = require("../routes/lawyer.routes");
const bookingRouter = require("../routes/booking.routes");
const TicketRouter = require("../routes/ticket.routes");
const meetingRouter = require("../routes/meeting.routes");

const setupRoutes = (app) => {
  app.use("/", viewsRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1", uploadRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/lawyers", lawyerRouter);
  app.use("/api/v1/bookings", bookingRouter);
  app.use("/api/v1/tickets", TicketRouter);
  app.use("/api/v1/meeting", meetingRouter);
};

module.exports = setupRoutes;

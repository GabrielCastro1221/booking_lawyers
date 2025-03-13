const bookingModel = require("../model/booking.model");

class BookingController {
  getAllBookings = async (req, res) => {
    try {
      const bookings = await bookingModel.find({});
      if (!bookings) {
        res.status(404).json({
          status: false,
          message: "No hay citas agendadas en la plataforma",
        });
      }
      res.status(201).json({
        status: true,
        message: "citas obtenidas con exito!",
        bookings: bookings,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los citas",
        error: error.message,
      });
    }
  };

  getBookingById = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        res.status(404).json({
          status: false,
          message: "Cita no encontrada",
        });
      }
      res.status(201).json({
        status: true,
        message: "cita encontrada con exito!",
        booking: booking,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener la cita",
        error: error.message,
      });
    }
  };

  updateBooking = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!booking) {
        res.status(404).json({
          status: false,
          message: "Cita no encontrada",
        });
      }
      res.status(201).json({
        status: true,
        message: "Cita actualizada con exito",
        booking: booking,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar la cita",
        error: error.message,
      });
    }
  };

  deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findByIdAndDelete(id);
      if (!booking) {
        res.status(404).json({
          status: false,
          message: "Cita no encontrada",
        });
      }
      res.status(201).json({
        status: true,
        message: "cita eliminada con exito!",
        booking: booking,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar la cita",
        error: error.message,
      });
    }
  };
}

module.exports = BookingController;

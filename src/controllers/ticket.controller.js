const ticketModel = require("../model/ticket.model");

class TicketController {
  getAllTickets = async (req, res) => {
    try {
      const tickets = await ticketModel.find({});
      if (!tickets) {
        res
          .status(404)
          .json({ status: false, message: " Tickets no encontrados" });
      }
      res.status(201).json({
        status: true,
        message: "Tickets encontrados con exito!",
        tickets: tickets,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener los tickets",
        error: error.message,
      });
    }
  };

  getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findById(id);
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      res.status(201).json({
        status: true,
        message: "Ticket encontrado con exito!",
        ticket: ticket,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener el ticket",
        error: error.message,
      });
    }
  };

  updateTicket = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      res.status(201).json({
        status: true,
        message: "Ticket actualizado con exito",
        ticket: ticket,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar el ticket",
        error: error.message,
      });
    }
  };

  deleteTicket = async (req, res) => {
    const { id } = req.params;
    try {
      const ticket = await ticketModel.findByIdAndDelete(id);
      if (!ticket) {
        res
          .status(404)
          .json({ status: false, message: "Ticket no encontrado" });
      }
      res.status(201).json({
        status: true,
        message: "Ticket eliminado con exito!",
        ticket: ticket,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar el ticket",
        error: error.message,
      });
    }
  };
}

module.exports = TicketController;

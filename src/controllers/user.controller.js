const userModel = require("../model/user.model");
const bookingModel = require("../model/booking.model");
const ticketModel = require("../model/ticket.model");
const lawyerModel = require("../model/lawyer.model");
const mongoose = require("mongoose");

class UserController {
  getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({});
      if (!users) {
        res.status(404).json({
          status: false,
          message: "No hay usuarios registrados en la plataforma",
        });
      }
      res.status(201).json({
        status: true,
        message: "Usuarios ontenidos con exito!",
        usuarios: users,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener usuarios",
        error: error.message,
      });
    }
  };

  getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        res.status(404).json({
          status: false,
          message: "Usuario no encontrado",
        });
      }
      res.status(201).json({
        status: true,
        message: "Usuario encontrado con exito!",
        usuario: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener usuario",
        error: error.message,
      });
    }
  };

  updateUser = async (req, res) => {
    const { id } = req.params;
    try {
      let photoUrl = req.body.photo;
      if (req.file) {
        photoUrl = req.file.path;
      }
      const user = await userModel.findByIdAndUpdate(
        id,
        { $set: { ...req.body, photo: photoUrl } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({
          status: false,
          message: "Usuario no encontrado",
        });
      }
      res.status(201).json({
        status: true,
        message: "Usuario actualizado con exito!",
        usuario: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar usuario",
        error: error.message,
      });
    }
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({
          status: false,
          message: "Usuario no encontrado",
        });
      }
      res.status(201).json({
        status: true,
        message: "Usuario elimiando con exito!",
        usuario: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar usuario",
        error: error.message,
      });
    }
  };

  getUserProfile = async (req, res) => {
    const userId = req.userId;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      const { password, ...rest } = user._doc;
      res.status(200).json({
        success: true,
        message: "Informacion del perfil obtenida exitosamente",
        data: { ...rest, bookings: user.booking },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener la informacion del perfil",
      });
    }
  };

  createAppointment = async (req, res) => {
    try {
      const { userId, lawyerId, appointment_date, ticket_price, type } =
        req.body;

      if (!userId || !lawyerId || !appointment_date || !ticket_price) {
        return res
          .status(400)
          .json({ message: "Todos los campos son requeridos." });
      }

      const userIdObj = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;
      const lawyerIdObj = mongoose.Types.ObjectId.isValid(lawyerId)
        ? new mongoose.Types.ObjectId(lawyerId)
        : null;

      if (!userIdObj || !lawyerIdObj) {
        return res
          .status(400)
          .json({ message: "ID de usuario o abogado no válidos." });
      }

      const appointmentStart = new Date(appointment_date);
      const appointmentEnd = new Date(appointmentStart);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 15);

      const citaExistente = await bookingModel.findOne({
        lawyer: lawyerIdObj,
        appointment_date: {
          $gte: appointmentStart,
          $lt: appointmentEnd,
        },
      });

      if (citaExistente) {
        return res.status(400).json({
          message: "La fecha y hora seleccionadas no están disponibles.",
        });
      }

      const nuevaCita = new bookingModel({
        lawyer: lawyerIdObj,
        user: userIdObj,
        appointment_date: appointmentStart,
        ticket_price,
        type,
      });
      await nuevaCita.save();

      const nuevoTicket = new ticketModel({
        code: `TICKET-${Date.now()}`,
        amount: ticket_price,
        appointment_date: appointmentStart,
        lawyer: lawyerIdObj,
        users: userIdObj,
        bookings: nuevaCita._id,
      });
      await nuevoTicket.save();

      await lawyerModel.findByIdAndUpdate(lawyerIdObj, {
        $push: { booking: nuevaCita._id },
      });
      await userModel.findByIdAndUpdate(userIdObj, {
        $push: { booking: nuevaCita._id },
      });

      res.status(201).json({
        message: "Cita agendada exitosamente.",
        cita: nuevaCita,
        ticket: nuevoTicket,
      });
    } catch (error) {
      console.error("Error al agendar la cita:", error);
      res.status(500).json({
        message: "Error al agendar la cita.",
        error: error.message,
      });
    }
  };

  changeRolAdmin = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      const newRol = user.role === "usuario" ? "admin" : "usuario";
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { role: newRol },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error cambiando el rol:", error);
      res.status(500).send("Error interno del servidor");
    }
  };

  cancelledAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        return res.status(404).send("Cita no encontrada");
      }
      const statusChange =
        booking.status === "pendiente" || "aprobada"
          ? "cancelada"
          : "pendiente";
      const statusUpdate = await bookingModel.findByIdAndUpdate(
        id,
        { status: statusChange },
        { new: true }
      );
      res.status(200).json(statusUpdate);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al cambiar el estado de la cita",
      });
    }
  };
}

module.exports = UserController;

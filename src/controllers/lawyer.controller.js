const lawyerModel = require("../model/lawyer.model");
const bookingModel = require("../model/booking.model");

class LawyerController {
  getAllLawyers = async (req, res) => {
    try {
      const lawyers = await lawyerModel.find({});
      if (!lawyers) {
        res.status(404).json({
          status: false,
          message: "No hay abogados registrados en la plataforma",
        });
      }
      res.status(201).json({
        status: true,
        message: "Abogados encontrados con exito!",
        abogados: lawyers,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener abogados",
        error: error.message,
      });
    }
  };

  getLawyerById = async (req, res) => {
    const { id } = req.params;
    try {
      const lawyer = await lawyerModel.findById(id);
      if (!lawyer) {
        res.status(404).json({
          status: false,
          message: "Abogado no encontrado",
        });
      }
      res.status(201).json({
        status: true,
        message: "Abogado encontrado con exito!",
        abogado: lawyer,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al obtener abogado",
        error: error.message,
      });
    }
  };

  updateLawyer = async (req, res) => {
    const { id } = req.params;
    try {
      let photoUrl = req.body.photo;
      if (req.file) {
        photoUrl = req.file.path;
      }

      const education = req.body.education
        ? JSON.parse(req.body.education)
        : undefined;
      const experiences = req.body.experiences
        ? JSON.parse(req.body.experiences)
        : undefined;
      const timeSlots = req.body.timeSlots
        ? JSON.parse(req.body.timeSlots)
        : undefined;

      const updateData = {
        ...req.body,
        photo: photoUrl,
      };

      if (education) updateData.education = education;
      if (experiences) updateData.experiences = experiences;
      if (timeSlots) updateData.timeSlots = timeSlots;

      const updatedLawyer = await lawyerModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedLawyer) {
        return res.status(404).json({
          status: false,
          message: "Abogado no encontrado",
        });
      }
      res.status(200).json({
        status: true,
        message: "Abogado actualizado con éxito",
        abogado: updatedLawyer,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al actualizar abogado",
        error: error.message,
      });
    }
  };

  deleteLawyer = async (req, res) => {
    const { id } = req.params;
    try {
      const lawyer = await lawyerModel.findByIdAndDelete(id);
      if (!lawyer) {
        res.status(404).json({
          status: false,
          message: "Abogado no encontrado",
        });
      }
      res.status(201).json({
        status: true,
        message: "Abogado eliminado con exito!",
        abogado: lawyer,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al eliminar abogado",
        error: error.message,
      });
    }
  };

  getLawyerProfile = async (req, res) => {
    const lawyerId = req.userId;
    try {
      const lawyer = await lawyerModel.findById(lawyerId);
      if (!lawyer) {
        return res.status(404).json({
          success: false,
          message: "Abogado no encontrado",
        });
      }
      const { password, ...rest } = lawyer._doc;

      res.status(200).json({
        success: true,
        message: "Informacion del perfil obtenida satisfactoriamente",
        data: { ...rest },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al obtener la informacion del perfil",
      });
    }
  };

  changeStatusAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      const booking = await bookingModel.findById(id);
      if (!booking) {
        return res.status(404).send("Cita no encontrada");
      }
      const statusChange =
        booking.status === "pendiente" || "aprobada" ? "aprobada" : "pendiente";
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

  changeApprovalStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const lawyer = await lawyerModel.findById(id);
      if (!lawyer) {
        return res.status(404).json({
          success: false,
          message: "Abogado no encontrado",
        });
      }
      const updatedLawyer = await lawyerModel.findByIdAndUpdate(
        id,
        { isApproved: "aprobado" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "aprobado"`,
        data: updatedLawyer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };

  cancelledStatus = async (req, res) => {
    const { id } = req.params;
    try {
      const lawyer = await lawyerModel.findById(id);
      if (!lawyer) {
        return res.status(404).json({
          success: false,
          message: "Abogado no encontrado",
        });
      }
      const updatedLawyer = await lawyerModel.findByIdAndUpdate(
        id,
        { isApproved: "cancelado" },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: `Estado de aprobación actualizado a "cancelado"`,
        data: updatedLawyer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el estado de aprobación",
        error: error.message,
      });
    }
  };
}

module.exports = LawyerController;

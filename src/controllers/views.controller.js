const lawyerModel = require("../model/lawyer.model");

class ViewsController {
  renderHome = (req, res) => {
    try {
      res.render("home");
    } catch (error) {
      res.send("error al renderizar home");
    }
  };

  renderLawyers = async (req, res) => {
    try {
      const lawyers = await lawyerModel.find({ isApproved: "aprobado" }).lean();
      if (!lawyers || lawyers.length === 0) {
        return res.render("lawyers", {
          lawyers: null,
          message:
            "Lo sentimos, No hay abogados disponibles en este momento...",
        });
      }
      res.render("lawyers", { lawyers });
    } catch (err) {
      res.render("notfound");
    }
  };

  renderLawyersDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const lawyer = await lawyerModel.findById(id).lean();
      if (!lawyer) {
        return res.render("404", { message: "Abogado no encontrado" });
      }
      res.render("lawyerDetail", { lawyer });
    } catch (err) {
      res.render("notFound");
    }
  };

  renderContact = (req, res) => {
    try {
      res.render("contact");
    } catch (error) {
      res.send("error al renderizar contact");
    }
  };

  renderLogin = (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      res.send("error al renderizar login");
    }
  };

  renderRegister = (req, res) => {
    try {
      res.render("register");
    } catch (error) {
      res.send("error al renderizar register");
    }
  };

  renderAbout = (req, res) => {
    try {
      res.render("about");
    } catch (error) {
      res.send("error al renderizar about");
    }
  };

  renderUserProfile = (req, res) => {
    try {
      res.render("userProfile");
    } catch (error) {
      res.send("error al renderizar perfil de usuario");
    }
  };

  renderLawyerProfile = (req, res) => {
    try {
      res.render("lawyerProfile");
    } catch (error) {
      res.send("error al renderizar perfil de abogado");
    }
  };

  renderNotFound = (req, res) => {
    try {
      res.render("notFound");
    } catch (error) {
      res.send("error al renderizar 404 page");
    }
  };
}

module.exports = ViewsController;

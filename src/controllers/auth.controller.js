const userModel = require("../model/user.model");
const lawyerModel = require("../model/lawyer.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hash.util");
const configObject = require("../config/env.config");
const bcrypt = require("bcrypt");
const MailerService = require("../services/mailer.service");
const { generarResetToken } = require("../utils/resetToken.util");

const mailer = new MailerService();

class AuthController {
  generateToken = (user) => {
    return jwt.sign(
      { id: user._id, role: user.role },
      configObject.auth.jwt_secret,
      {
        expiresIn: "15d",
      }
    );
  };

  register = async (req, res) => {
    try {
      const {
        email,
        password,
        name,
        last_name,
        role,
        gender,
        phone,
        ticket_price,
        bio,
        about,
        specialization,
        education,
        experiences,
        timeSlots,
      } = req.body;
      const photo = req.file ? req.file.path : null;

      if (!email || !password || !name || !role) {
        return res.status(403).json({
          status: false,
          message:
            "Los campos nombre, correo electrónico, contraseña y rol son obligatorios",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Formato de correo electrónico no válido",
        });
      }

      const userExists = await userModel.findOne({ email });
      const lawyerExists = await lawyerModel.findOne({ email });

      if (userExists || lawyerExists) {
        return res.status(409).json({
          status: false,
          message: `El correo electrónico ${email} ya está registrado`,
        });
      }

      let user = null;

      if (role === "usuario") {
        user = new userModel({
          email,
          password: createHash(password),
          name,
          last_name,
          phone,
          photo,
          gender,
        });
      } else if (role === "abogado") {
        user = new lawyerModel({
          name,
          email,
          password: createHash(password),
          photo,
          gender,
          role,
          phone,
          ticket_price,
          bio,
          about,
          specialization,
          education,
          experiences,
          timeSlots,
        });
      }

      if (user) {
        await user.save();
        res.status(201).json({
          status: true,
          message: "Registro exitoso",
          user: user,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Rol no válido",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error al registrar usuario",
        error: error.message,
      });
    }
  };

  login = async (req, res) => {
    const { email } = req.body;
    try {
      let user = null;
      const usuario = await userModel.findOne({ email });
      const lawyer = await lawyerModel.findOne({ email });

      if (usuario) {
        user = usuario;
      } else if (lawyer) {
        user = lawyer;
      }
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Credenciales incorrectas",
        });
      }
      const token = this.generateToken(user);
      const { password, role, appointments, ...rest } = user._doc;
      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso!",
        token,
        data: { ...rest, role },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error al iniciar sesión",
      });
    }
  };

  RequestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = await lawyerModel.findOne({ email });
      }
      if (!user) {
        return res.render("resetPass", { error: "Usuario no encontrado" });
      }
      const token = generarResetToken();
      user.token_reset = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();
      await mailer.enviarCorreoRestablecimiento(email, token);
      res.redirect("/confirm");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };

  resetPassword = async (req, res) => {
    const { email, password, token } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = await lawyerModel.findOne({ email });
      }
      if (!user) {
        return res.render("resetPass", { error: "Usuario no encontrado" });
      }
      const resetToken = user.token_reset;
      if (!resetToken || resetToken.token !== token) {
        return res.render("resetPass", { error: "Token invalido" });
      }
      const ahora = new Date();
      if (ahora > resetToken.expire) {
        return res.render("resetPass", { error: "El token expiro" });
      }
      if (isValidPassword(password, user)) {
        return res.render("resetPass", {
          error: "La nueva contraseña no puede ser igual a a la anterior",
        });
      }
      user.password = createHash(password);
      user.token_reset = undefined;
      await user.save();
      return res.redirect("/login");
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "error interno del servidor",
        error: err.message,
      });
    }
  };
}

module.exports = AuthController;

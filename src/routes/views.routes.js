const { Router } = require("express");
const ViewsController = require("../controllers/views.controller");

const router = Router();
const views = new ViewsController();

router.get("/", views.renderHome);
router.get("/abogados", views.renderLawyers);
router.get("/abogados/:id", views.renderLawyersDetail);
router.get("/contacto", views.renderContact);
router.get("/login", views.renderLogin);
router.get("/register", views.renderRegister);
router.get("/sobre-nosotros", views.renderAbout);
router.get("/perfil-usuario", views.renderUserProfile);
router.get("/perfil-abogado", views.renderLawyerProfile);
router.get("/404", views.renderNotFound);

module.exports = router;

const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const path = require("path");

module.exports = (app) => {
  Handlebars.registerHelper("eq", (a, b) => a === b);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "../views"));
};

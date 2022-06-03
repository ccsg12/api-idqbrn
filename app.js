const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug")("idqbrn:startup");

const connection = require("./database");

connection
  .authenticate()
  .then(() => debug("Conexão com o banco de dados estabelecida com sucesso."))
  .catch((error) => {
    console.error("Ocorreu um erro ao tentar conectar com o banco de dados.");
    debug(error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  });

const casesRouter = require("./routes/cases");
const citiesRouter = require("./routes/cities");
const diseasesRouter = require("./routes/diseases");
const rolesRouter = require("./routes/roles");
const usersRouter = require("./routes/users");

const app = express();

if (app.get("env") === "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/cases", casesRouter);
app.use("/cities", citiesRouter);
app.use("/diseases", diseasesRouter);
app.use("/roles", rolesRouter);
app.use("/users", usersRouter);

module.exports = app;

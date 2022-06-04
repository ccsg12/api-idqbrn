const express = require("express");
const cookieParser = require("cookie-parser");
const config = require("config");
const logger = require("morgan");
const debug = require("debug")("idqbrn:startup");

if (!config.get("jwtPrivateKey")) {
  debug("Variável de ambiente jwtPrivateKey não informada.");
  // eslint-disable-next-line no-undef
  process.exit(1);
}

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
const indexRouter = require("./routes");
const rolesRouter = require("./routes/roles");
const usersRouter = require("./routes/users");

const app = express();

if (app.get("env") === "development") {
  app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", indexRouter);
app.use("/api/cases", casesRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/diseases", diseasesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/users", usersRouter);

module.exports = app;

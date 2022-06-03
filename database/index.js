const { Sequelize } = require("sequelize");
const config = require("config");

module.exports = new Sequelize(
  "idqbrn",
  config.get("database.username"),
  config.get("database.password"),
  {
    host: config.get("database.host"),
    dialect: "mysql",
  }
);

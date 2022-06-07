const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");
const City = require("./City");
const Disease = require("./Disease");

class Case extends Model {}

Case.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cidadeId: {
      comment: "Id da cidade que o caso foi registrado.",
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    quantidade: {
      comment: "Define a quantidade de casos confirmados.",
      default: 0,
      type: DataTypes.INTEGER,
    },
    doencaId: {
      comment: "Id da doença para qual o caso foi registrado.",
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "casos",
  }
);

City.belongsToMany(Disease, { through: Case, as: "diseases" });
Disease.belongsToMany(City, { through: Case, as: "cities" });

Case.sync()
  .then(() => debug("Tabela de casos ocorridos criada."))
  .catch((error) => debug(error));

module.exports = Case;

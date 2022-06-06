const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");
const City = require("./City");
const Disease = require("./Disease");

class Case extends Model {}

Case.init(
  {
    cidadeId: {
      comment: "Id da cidade que o caso foi registrado.",
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    quantidade: {
      comment: "Define a quant de casos confirmados.",
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

City.belongsToMany(Disease, { through: Case });
Disease.belongsToMany(City, { through: Case });

Case.sync()
  .then(() => debug("Tabela de casos ocorridos criada."))
  .catch((error) => debug(error));

module.exports = Case;

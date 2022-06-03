const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");

class City extends Model {}

City.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigoIBGE: {
      allowNull: false,
      comment: "Código do município segundo o IBGE.",
      type: DataTypes.INTEGER,
      unique: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
    },
    longitude: {
      type: DataTypes.DOUBLE,
    },
    population: {
      type: DataTypes.INTEGER,
    },
    state: {
      allowNull: false,
      comment: "Sigla do estado correspondente do município.",
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "cidades",
  }
);

City.sync()
  .then(() => debug("Tabela de cidades criada."))
  .catch((error) => debug(error));

module.exports = City;

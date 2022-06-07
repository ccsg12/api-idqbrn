const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");

class City extends Model {}

City.init(
  {
    nome: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    codigoIBGE: {
      allowNull: false,
      comment: "Código do município segundo o IBGE.",
      type: DataTypes.INTEGER,
      unique: true,
    },
    latitude: {
      allowNull: false,
      comment: "Valor numérico da latitude do centro da cidade.",
      type: DataTypes.DOUBLE,
    },
    longitude: {
      allowNull: false,
      comment: "Valor numérico da longitude do centro da cidade.",
      type: DataTypes.DOUBLE,
    },
    populacao: {
      type: DataTypes.INTEGER,
    },
    estado: {
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

City.sync({ alter: false, force: false })
  .then(() => debug("Tabela de cidades criada."))
  .catch((error) => debug(error));

module.exports = City;

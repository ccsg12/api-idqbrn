const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");

class Disease extends Model {}

Disease.init(
  {
    nome: {
      type: DataTypes.STRING,
    },
    prevencao: {
      comment: "Texto com as noções para prevenção da doença (se houver).",
      type: DataTypes.TEXT,
    },
    tratamento: {
      comment: "Texto com o tratamento adequado para a doença (se houver).",
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "doencas",
  }
);

Disease.sync()
  .then(() => debug("Tabela de doenças epidemiológicas criada."))
  .catch((error) => debug(error));

module.exports = Disease;

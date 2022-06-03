const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");

class Role extends Model {}

Role.init(
  {
    funcao: {
      allowNull: false,
      comment:
        "Campo que define a função do usuário e o seu grau de autorização no projeto.",
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "funcao",
    tableName: "funcoes",
  }
);

Role.sync()
  .then(() => debug("Tabela de funcões dos usuários criada."))
  .catch((error) => debug(error));

module.exports = Role;

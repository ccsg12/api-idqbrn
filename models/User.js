const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");

const sequelize = require("../database");
const Role = require("./Role");

class User extends Model {}

User.init(
  {
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING,
    },
    senha: {
      comment: "Senha do usuário com hash.",
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: "usuarios",
  }
);

Role.hasMany(User);
User.belongsTo(Role);

User.sync({ alter: false, force: false })
  .then(() => debug("Tabela de usuários criada."))
  .catch((error) => debug(error));

module.exports = User;

const { DataTypes, Model } = require("sequelize");
const debug = require("debug")("idqbrn:db");
const config = require("config");
const bcrypt = require("bcrypt");

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

User.sync()
  .then(() =>
    Role.findOrCreate({
      where: { id: 1 },
      defaults: { funcao: "Administrador" },
    })
  )
  .then(() =>
    Role.findOrCreate({
      where: { id: 2 },
      defaults: { funcao: "Editor" },
    })
  )
  .then(() => bcrypt.hash(config.get("admin_password"), 10))
  .then((hash) => {
    debug(hash);
    return User.findOrCreate({
      where: { id: 1 },
      defaults: {
        nome: "Administrador",
        email: "admin@idqbrn.eb.br",
        senha: hash,
        funcaoId: 1,
      },
    });
  })
  .then(() => debug("Tabela de usuários criada."))
  .catch((error) => debug(error));

module.exports = User;

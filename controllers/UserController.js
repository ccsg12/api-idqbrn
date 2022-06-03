const bcrypt = require("bcrypt");
const _ = require("lodash");
const debug = require("debug")("idqbrn:controller");

const User = require("../models/User");
const Role = require("../models/Role");

const bcryptSalt = 10;

module.exports = class UserController {
  create = async (req, res) => {
    const { nome, senha, funcaoId, email } = req.body;

    if (!email) {
      res.status(400);
      res.json({ error: "O e-mail é obrigatório." });
      return;
    }

    try {
      let newUser = await User.findOne({ where: { email } });

      if (!newUser) {
        newUser = {
          nome,
          email,
        };

        let role = await Role.findByPk(funcaoId);

        if (role) {
          newUser.funcaoId = funcaoId;

          newUser.senha = await bcrypt.hash(senha, bcryptSalt);

          let user = await User.create(newUser);
          user = _.pick(user, ["id", "nome", "email"]);
          user.funcao = role.funcao;

          debug(user);
          res.status(201);
          res.send(user);
        } else {
          res.status(400);
          res.send({ error: "Função inválida." });
        }
      } else {
        res.status(406);
        res.send({ error: "O e-mail já está cadastrado." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;

      if (id && !isNaN(id)) {
        const user = await User.findByPk(id);

        if (user) {
          await User.destroy({ where: { id } });

          res.status(204);
          res.send();
        } else {
          res.status(404);
          res.send({ error: "Usuário não encontrado." });
        }
      } else {
        res.status(400);
        res.send({ error: "Requisição inválida." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  findAll = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "nome", "email"],
        include: "funcao",
      });

      res.send(users);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  findById = async (req, res) => {
    try {
      const { id } = req.params;

      if (id && !isNaN(id)) {
        const user = await User.findByPk(id, {
          include: "funcao",
        });

        if (user) {
          res.send(_.pick(user, ["id", "nome", "email", "funcao"]));
        } else {
          res.status(404);
          res.send({ error: "Usuário não encontrado." });
        }
      } else {
        res.status(400);
        res.send({ error: "Requisição inválida." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  update = async (req, res) => {
    try {
      const { id, nome, email, senha, funcaoId } = req.body;

      if (id && !isNaN(id)) {
        let user = await User.findByPk(id);

        if (user) {
          let userDetails = {
            nome,
            email,
            funcaoId,
          };

          if (senha) {
            userDetails.senha = await bcrypt.hash(senha, bcryptSalt);
          }

          await User.update(userDetails, { where: { id } });
          await user.reload();

          res.send(_.pick(user, ["id", "nome", "email", "funcaoId"]));
        } else {
          res.status(404);
          res.send({ error: "Usuário não encontrado." });
        }
      } else {
        res.status(400);
        res.send({ error: "Requisição inválida." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };
};

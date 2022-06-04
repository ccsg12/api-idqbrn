const bcrypt = require("bcrypt");
const config = require("config");
const debug = require("debug")("idqbrn:controller");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const User = require("../models/User");

module.exports = class AuthController {
  signIn = async (req, res) => {
    const { senha, email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (user && (await bcrypt.compare(senha, user.senha))) {
        const token = jwt.sign(
          _.pick(user, ["id", "name", "email", "funcaoId"]),
          config.get("jwtPrivateKey")
        );
        debug(token);

        res.send({ token });
      } else {
        res.status(400);
        req.send({ error: "Requisição inválida" });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };
};

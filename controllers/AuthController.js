const bcrypt = require("bcrypt");
const config = require("config");
const debug = require("debug")("idqbrn:controller");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const User = require("../models/User");

module.exports = class AuthController {
  signIn = async (req, res) => {
    const { senha, email } = req.body;
    debug({ senha, email });

    try {
      const user = await User.findOne({ where: { email } });
      debug(user);

      if (user && (await bcrypt.compare(senha, user.senha))) {
        const token = jwt.sign(
          _.pick(user, ["id", "nome", "email", "funcaoId"]),
          config.get("jwtPrivateKey")
        );
        debug(token);

        res.send({ token });
      } else {
        res.status(400);
        req.send({ message: "Requisição inválida" });
      }
    } catch (error) {
      res.status(500);
      debug(error);
      res.send(error);
    }
  };
};

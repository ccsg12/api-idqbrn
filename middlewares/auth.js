const config = require("config");
const debug = require("debug")("idqbrn:middleware");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const auth = (req, res, next) => {
  try {
    if (req.headers["authorization"]) {
      const [type, token] = req.headers["authorization"].split(" ");
      debug(type);

      if (type === "Bearer" && token) {
        debug(type);
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        const user = User.findOne({ where: { email: decoded.email } });
        if (user) {
          next();
          return;
        }
      }
    }

    res.status(401);
    res.send({ message: "Usuário não autenticado." });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

module.exports = auth;

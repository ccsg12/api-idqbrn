const config = require("config");
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    if (decoded.funcaoId === 1) {
      next();
    } else {
      res.status(403);
      res.send({ error: "Usuário sem permissão." });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
  }
};

module.exports = adminAuth;

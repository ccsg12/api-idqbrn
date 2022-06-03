const Role = require("../models/Role");

module.exports = class RoleController {
  create = async (req, res) => {
    const { funcao } = req.body;

    try {
      const role = await Role.create({ funcao });

      res.status(201);
      res.send(role);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  findAll = async (req, res) => {
    try {
      const roles = await Role.findAll({
        attributes: ["id", "funcao"],
      });
      res.send(roles);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };
};

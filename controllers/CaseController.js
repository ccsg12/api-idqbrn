const Case = require("../models/Case");

module.exports = class CaseController {
  list = async (req, res) => {
    try {
      const cases = Case.findAll();
      res.send(cases);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };
};

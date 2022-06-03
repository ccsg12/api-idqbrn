const Disease = require("../models/Disease");

module.exports = class DiseaseController {
  list = async (req, res) => {
    try {
      const disease = await Disease.findAll();
      res.send(disease);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };
};

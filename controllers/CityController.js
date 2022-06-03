const City = require("../models/City");

module.exports = class CityController {
  list = async (req, res) => {
    try {
      const cities = await City.findAll();
      res.send(cities);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };
};

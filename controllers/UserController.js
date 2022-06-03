const User = require("../models/User");

module.exports = class UserController {
  list = async (req, res) => {
    try {
      const users = await User.findAll();
      res.send(users);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };
};

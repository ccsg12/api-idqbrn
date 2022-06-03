const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

router.get("/", userController.list);

module.exports = router;

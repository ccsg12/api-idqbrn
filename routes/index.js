const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const authController = new AuthController();

router.post("/sign-in", authController.signIn);

module.exports = router;

const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const FileUploadController = require("../controllers/FileUploadController");

const authController = new AuthController();
const fileUploadController = new FileUploadController();

router.post("/sign-in", authController.signIn);
router.post("/upload/csv", fileUploadController.csvUpload);

module.exports = router;

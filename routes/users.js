const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");

router.use(auth);
router.use(adminAuth);

router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.post("/", userController.create);
router.delete("/:id", userController.delete);
router.put("/", userController.update);

module.exports = router;

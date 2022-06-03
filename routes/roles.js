const express = require("express");
const router = express.Router();

const RoleController = require("../controllers/RoleController");
const roleController = new RoleController();

router.get("/", roleController.findAll);
router.post("/", roleController.create);

module.exports = router;

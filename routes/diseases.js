const express = require("express");
const router = express.Router();

const DiseaseController = require("../controllers/DiseaseController");
const diseaseController = new DiseaseController();

router.get("/", diseaseController.list);

module.exports = router;

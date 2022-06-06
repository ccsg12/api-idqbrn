const express = require("express");
const router = express.Router();

const DiseaseController = require("../controllers/DiseaseController");
const diseaseController = new DiseaseController();

router.get("/", diseaseController.list);
router.get("/cities", diseaseController.listWithCities);
router.get("/:id", diseaseController.findById);
router.post("/", diseaseController.create);
router.delete("/:id", diseaseController.delete);
router.put("/", diseaseController.update);

module.exports = router;

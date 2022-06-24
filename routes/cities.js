const express = require("express");
const router = express.Router();

const CityController = require("../controllers/CityController");
const cityController = new CityController();

router.get("/", cityController.list);
router.get("/resumed", cityController.listResumed);
router.get("/:id", cityController.findById);
router.post("/", cityController.create);
router.delete("/:id", cityController.delete);
router.put("/", cityController.update);

module.exports = router;

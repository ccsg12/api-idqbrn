const express = require("express");
const router = express.Router();

const CityController = require("../controllers/CityController");
const cityController = new CityController();

router.get("/", cityController.list);

module.exports = router;

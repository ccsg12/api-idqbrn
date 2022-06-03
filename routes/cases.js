const express = require("express");
const router = express.Router();

const CaseController = require("../controllers/CaseController");
const caseController = new CaseController();

router.get("/", caseController.list);

module.exports = router;

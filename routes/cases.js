const express = require("express");
const router = express.Router();

const CaseController = require("../controllers/CaseController");
const caseController = new CaseController();

router.get("/", caseController.list);
router.get("/:doencaId", caseController.doenca_case);
router.post("/", caseController.create);
router.delete("/:cidadeId/:doencaId", caseController.delete);
router.put("/", caseController.update);

module.exports = router;

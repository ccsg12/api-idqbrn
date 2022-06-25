const express = require("express");
const router = express.Router();

const CaseController = require("../controllers/CaseController");
const caseController = new CaseController();

router.get("/", caseController.list);
router.get("/:doencaId", caseController.listByDisease);
router.post("/", caseController.create);
router.post("/bulk", caseController.bulkCreate);
router.delete("/:id", caseController.delete);
router.put("/", caseController.update);

module.exports = router;

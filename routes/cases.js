const express = require("express");
const router = express.Router();

const CaseController = require("../controllers/CaseController");
const caseController = new CaseController();

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000" ); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get("/", caseController.list);
router.get("/:doencaId", caseController.doenca_case);
router.post("/", caseController.create);
router.post("/csv", caseController.csv_create);
router.post("/bulk", caseController.bulk_create);

router.delete("/:cidadeId/:doencaId", caseController.delete);
router.put("/", caseController.update);

module.exports = router;

  
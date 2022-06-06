const express = require("express");
const router = express.Router();

const DiseaseController = require("../controllers/DiseaseController");
const diseaseController = new DiseaseController();


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000" ); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get("/", diseaseController.list);
router.get("/:id", diseaseController.findById);
router.post("/", diseaseController.create);
router.delete("/:id", diseaseController.delete);
router.put("/", diseaseController.update);

module.exports = router;

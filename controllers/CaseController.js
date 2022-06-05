const Case = require("../models/Case");

module.exports = class CaseController {
  list = async (req, res) => {
    try {
      const cases = Case.findAll();
      res.send(cases);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };


  create = async (req, res) => {
    const { cidadeId, confirmed , doencaId  } = req.body;

    if (!cidadeId) {
      res.status(400);
      res.json({ error: "O Id da cidade é obrigatório." });
      return;
    }

    if (!doencaId) {
      res.status(400);
      res.json({ error: "O Id da doenca é obrigatório." });
      return;
    }

    try {
      let newDisease; 

       
        newDisease = {
          cidadeId,
          prevencao,
          tratamento,          
        }; 

        let disease = await Disease.create(newUser);
          disease = _.pick(disease, ["id", "nome", "prevencao","tratamento"]);
       
      

    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

};

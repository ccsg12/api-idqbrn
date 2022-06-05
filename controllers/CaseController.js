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
    const { nome, prevencao, tratamento  } = req.body;

    if (!nome) {
      res.status(400);
      res.json({ error: "O nome é obrigatório." });
      return;
    }

    try {
      let newDisease = await Disease.findOne({ where: { nome } });

      if (!newDisease) {
        newDisease = {
          nome,
          prevencao,
          tratamento,          
        }; 

        let disease = await Disease.create(newUser);
          disease = _.pick(disease, ["id", "nome", "prevencao","tratamento"]);
       
      } else {
        res.status(406);
        res.send({ error: "A doenca já esta cadastrada." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

};

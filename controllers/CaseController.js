const Case = require("../models/Case");

module.exports = class CaseController {
  list = async (req, res) => {
    try {
      const cases = await Case.findAll();
      res.send(cases);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };


  create = async (req, res) => {
    const { cidadeId, quantidade , doencaId  } = req.body;

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
      let newCase; 

      
        newCase = {
          cidadeId,
          quantidade,
          doencaId,        
        }; 

        let cases = await Case.create(newCase);
          cases = _.pick(cases, ["id", "cidadeId", "quantidade","doencaId"]);
       
          debug(cases);
          res.status(201);
          res.send(cases); 
     
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };


  delete = async (req, res) => {
    try {
      const { cidadeId } = req.params;

      if (cidadeId && !isNaN(cidadeId)) {
        const cases = await Case.findByPk(cidadeId);

        if (cases) {
          await Case.destroy({ where: { cidadeId } });

          res.status(204);
          res.send();
        } else {
          res.status(404);
          res.send({ error: "Caso nao encontrado" });
        }
      } else {
        res.status(400);
        res.send({ error: "Requisição inválida." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };


  findById = async (req, res) => {
    try {
      const { id } = req.params;

      if (id && !isNaN(id)) {
        const cases = await Case.findByPk(id)

        if (cases) {
          res.send(_.pick(cases, ["id", "cidadeId", "confirmed","doencaId"]));
        } else {
          res.status(404);
          res.send({ error: "Caso não encontrado." });
        }
      } else {
        res.status(400);
        res.send({ error: "Requisição inválida." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };


  update = async (req, res) => {
    try {
      const { id, cidadeId, quantidade , doencaId } = req.body;

      if (id && !isNaN(id)) {
        let cases = await Case.findByPk(id);

        if (cases) {
          let caseDetails = {
            cidadeId,
            confirmed,
            doencaId,
          };          

          await Case.update(caseDetails, { where: { id } });
          await cases.reload();

          res.send(_.pick(cases, ["id", "cidadeId", "quantidade","doencaId"]));
        } else {
          res.status(404);
          res.send({ error: "Caso não encontrado." });
        }
      } else {
        res.status(400);
        res.send({ error: "Requisição inválida." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };


};

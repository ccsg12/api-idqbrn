const Disease = require("../models/Disease");

module.exports = class DiseaseController {
  list = async (req, res) => {
    try {
      const disease = await Disease.findAll();
      res.send(disease);
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


  delete = async (req, res) => {
    try {
      const { id } = req.params;

      if (id && !isNaN(id)) {
        const disease = await Disease.findByPk(id);

        if (disease) {
          await Disease.destroy({ where: { id } });

          res.status(204);
          res.send();
        } else {
          res.status(404);
          res.send({ error: "Doenca nao encontrada" });
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
        const disease = await Disease.findByPk(id)

        if (disease) {
          res.send(_.pick(disease, ["id", "nome", "prevencao","tratamento"]));
        } else {
          res.status(404);
          res.send({ error: "Doenca não encontrado." });
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
      const { id, nome, prevencao , tratamento } = req.body;

      if (id && !isNaN(id)) {
        let disease = await Disease.findByPk(id);

        if (disease) {
          let diseaseDetails = {
            nome,
            prevencao,
            tratamento,
          };          

          await Disease.update(diseaseDetails, { where: { id } });
          await disease.reload();

          res.send(_.pick(disease, ["id", "nome", "prevencao","tratamento"]));
        } else {
          res.status(404);
          res.send({ error: "Doenca não encontrado." });
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

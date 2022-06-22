const _ = require("lodash");
const debug = require("debug")("idqbrn:controller");

const Case = require("../models/Case");

module.exports = class CaseController {
  list= async (req, res) => {
    try {
      const page = req.query.page;
      const pagination = 1;
      let offset = 0;

      if(isNaN(page) || page == 1){
        offset = 0;
      }else {
        offset = (parseInt(page)-1)*pagination;
      }

      const cases = await Case.findAndCountAll({
        limit: pagination,
        offset: offset
      });

      let next;
      if(offset + pagination >= cases.count){
        next = false;
      }else{
        next = true;
      }
      cases.next = next;

      res.send(cases);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };

  bulkCreate = async (req, res) => {
    const data = req.body;
    try {
      const cases = await Case.bulkCreate(data);
      res.send(cases);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  create = async (req, res) => {
    const { cidadeId, quantidade, doencaId } = req.body;

    if (!cidadeId) {
      res.status(400);
      res.json({ error: "O Id da cidade é obrigatório." });
      return;
    }

    if (!doencaId) {
      res.status(400);
      res.json({ error: "O Id da doença é obrigatório." });
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
      cases = _.pick(cases, ["id", "cidadeId", "quantidade", "doencaId"]);

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
      const { cidadeId, doencaId } = req.params;

      const cases = await Case.findByPk(cidadeId);

      if (cases) {
        await Case.destroy({ where: { cidadeId, doencaId } });

        res.status(204);
        res.send();
      } else {
        res.status(404);
        res.send({ message: "Caso não encontrado." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  update = async (req, res) => {
    try {
      const { cidadeId, quantidade, doencaId } = req.body;

      let cases = await Case.findByPk(cidadeId);

      if (cases) {
        let caseDetails = {
          quantidade,
        };

        await Case.update(caseDetails, { where: { cidadeId, doencaId } });
        await cases.reload();

        res.send(_.pick(cases, ["cidadeId", "quantidade", "doencaId"]));
      } else {
        res.status(404);
        res.send({ message: "Caso não encontrado." });
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  listByDisease = async (req, res) => {
    try {
      const { doencaId } = req.params;

      const cases = await Case.findAll({ where: { doencaId } });

      res.send(cases);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };
};

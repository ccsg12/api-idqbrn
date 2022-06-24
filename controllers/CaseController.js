const _ = require("lodash");
const debug = require("debug")("idqbrn:controller");

const Case = require("../models/Case");

module.exports = class CaseController {
  list = async (req, res) => {
    try {
      let page = req.query.page;
      let limit = req.query.perPage;

      let cases;
      if (page || limit) {
        page = page ?? 1;
        limit = limit ?? 10;

        const isValid = !isNaN(page) && !isNaN(limit) && page > 0 && limit > 0;

        if (isValid) {
          const offset = (parseInt(page) - 1) * limit;

          cases = await Case.findAndCountAll({
            limit: parseInt(limit),
            offset,
          });

          cases.next = offset + limit < cases.count;

          res.send(cases);
        }
      } else {
        cases = await Case.findAll();

        res.send(cases);
      }
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

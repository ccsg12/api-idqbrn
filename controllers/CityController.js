const _ = require("lodash");
const debug = require("debug")("idqbrn:controller");

const City = require("../models/City");

module.exports = class CityController {
  list = async (req, res) => {
    try {
      const cities = await City.findAll();
      res.send(cities);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  };

  create = async (req, res) => {
    const { nome, codigoIBGE, latitude, longitude, populacao, estado } =
      req.body;

    if (!nome) {
      res.status(400);
      res.json({ error: "O nome da cidade é obrigatório." });
      return;
    }

    if (!codigoIBGE) {
      res.status(400);
      res.json({ error: "O CódigoIBGE é obrigatório." });
      return;
    }

    try {
      let newCity = await City.findOne({ where: { nome } });

      if (!newCity) {
        newCity = {
          nome,
          codigoIBGE,
          latitude,
          longitude,
          populacao,
          estado,
        };

        let cities = await City.create(newCity);
        cities = _.pick(cities, [
          "id",
          "nome",
          "codigoIBGE",
          "latitude",
          "longitude",
          "populacao",
          "estado",
        ]);

        debug(cities);
        res.status(201);
        res.send(cities);
      } else {
        res.status(406);
        res.send({ error: "A cidade já esta cadastrada." });
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
        const cities = await City.findByPk(id);

        if (cities) {
          await City.destroy({ where: { id } });

          res.status(204);
          res.send();
        } else {
          res.status(404);
          res.send({ error: "Cidade nao encontrada" });
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
        const cities = await City.findByPk(id);

        if (cities) {
          res.send(
            _.pick(cities, [
              "id",
              "nome",
              "codigoIBGE",
              "latitude",
              "longitude",
              "populacao",
              "estado",
            ])
          );
        } else {
          res.status(404);
          res.send({ error: "Cidade não encontrada." });
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
      const { id, nome, codigoIBGE, latitude, longitude, populacao, estado } =
        req.body;

      if (id && !isNaN(id)) {
        let cities = await City.findByPk(id);

        if (cities) {
          let citiesDetails = {
            nome,
            codigoIBGE,
            latitude,
            longitude,
            populacao,
            estado,
          };

          await City.update(citiesDetails, { where: { id } });
          await cities.reload();

          res.send(
            _.pick(cities, [
              "id",
              "nome",
              "codigoIBGE",
              "latitude",
              "longitude",
              "populacao",
              "estado",
            ])
          );
        } else {
          res.status(404);
          res.send({ error: "Cidade não encontrada." });
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

const Case = require("../models/Case");
const _ = require("lodash");
const City = require("../models/City");
const Disease = require("../models/Disease");

module.exports = class FileUploadController {
  csvUpload = async (req, res) => {
    if (!req.files || !req.files.file) {
      res.status(404).send("File not found");
    } else if (req.files.file.mimetype === "text/csv") {
      let csvFile = req.files.file;
      const data = csvParse(csvFile);

      Case.destroy({
        truncate: true,
      }).then(() => {});

      data[1] = _.uniqBy(data[1], "codigoIBGE");
      data[2] = _.uniqBy(data[2], "nome");
      let cities = data[1];
      let diseases = data[2];

      const dbCities = (await City.findAll({ attributes: ["codigoIBGE"] })).map(
        (x) => x.codigoIBGE
      );
      const dbDiseases = (await Disease.findAll({ attributes: ["nome"] })).map(
        (x) => x.nome
      );

      if (dbCities.length > 0) {
        cities = _.remove(data[1], function (value) {
          return _.find(dbCities, value.codigoIBGE);
        });
      }
      if (dbDiseases.length > 0) {
        diseases = _.remove(data[2], function (value) {
          return _.find(dbDiseases, value.nome);
        });
      }

      City.bulkCreate(cities)
        .then(() => {
          Disease.bulkCreate(diseases);
        })
        .then(() => {
          Case.bulkCreate(data[0]);
        })
        .then(() => {
          res.status(201);
          res.send();
        })
        .catch((err) => {
          res.send(err.message);
        });
    } else {
      res.status(422);
      res.send({ error: "Requisição inválida" });
    }
  };
};

const csvParse = function (csvFile) {
  const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
  const hexToUtf8 = convert("hex", "utf8");

  let csvData = hexToUtf8(csvFile.data).split("\r\n");
  let csvRows = [];
  csvData.forEach((data) => {
    csvRows.push(data.split(","));
  });

  let data = [];
  let dataCase = [];
  let dataCity = [];
  let dataDisease = [];

  for (let i = 1; i < csvRows.length; ++i) {
    let dictCase = {};
    let dictCity = {};
    let dictDisease = {};

    for (let j = 0; j < 3; ++j) {
      if (isNaN(parseInt(csvRows[i][j]))) {
        dictCase[csvRows[0][j]] = csvRows[i][j];
      } else {
        dictCase[csvRows[0][j]] = parseInt(csvRows[i][j]);
      }
    }
    for (let j = 3; j < 9; ++j) {
      if (isNaN(parseInt(csvRows[i][j]))) {
        dictCity[csvRows[0][j]] = csvRows[i][j];
      } else {
        dictCity[csvRows[0][j]] = parseFloat(csvRows[i][j]);
      }
    }
    for (let j = 9; j < 12; ++j) {
      if (isNaN(parseInt(csvRows[i][j]))) {
        dictDisease[csvRows[0][j]] = csvRows[i][j];
      } else {
        dictDisease[csvRows[0][j]] = parseInt(csvRows[i][j]);
      }
    }

    dataCase.push(dictCase);
    dataCity.push(dictCity);
    dataDisease.push(dictDisease);
  }

  data.push(dataCase);
  data.push(dataCity);
  data.push(dataDisease);

  return data;
};

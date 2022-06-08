const _ = require("lodash");
const debug = require("debug")("idqbrn:update_file");

const Case = require("../models/Case");
const City = require("../models/City");
const Disease = require("../models/Disease");

module.exports = class FileUploadController {
  csvUpload = async (req, res) => {
    if (!req.files || !req.files.file) {
      res.status(404);
      res.send({ message: "Requisição inválida. Arquivo não encontrado" });
    } else if (req.files.file.mimetype === "text/csv") {
      Case.drop()
        .then(() => City.destroy({ truncate: true, force: true }))
        .then(() => Disease.destroy({ truncate: true, force: true }))
        .then(() =>
          Case.sync({ alter: false, force: false })
            .then(() => debug("Tabela de casos ocorridos criada."))
            .catch((error) => debug(error))
        )
        .then(() => {
          let csvFile = req.files.file;
          const data = csvParse(csvFile);

          data[1] = _.uniqBy(data[1], "codigoIBGE");
          data[2] = _.uniqBy(data[2], "nome");
          let cities = data[1];
          let diseases = data[2];

          City.bulkCreate(cities)
            .then((result) => {
              cities = result;
              debug(cities);

              return Disease.bulkCreate(diseases);
            })
            .then((result) => {
              diseases = result;
              debug(diseases);

              debug(data[0]);

              data[0] = data[0].map((dataCase) => {
                const diseaseCase = {
                  quantidade: dataCase["quantidade"],
                };

                diseaseCase.cidadeId = cities.find(
                  (city) => city.codigoIBGE === dataCase["codigoIBGE"]
                ).id;
                diseaseCase.doencaId = diseases.find(
                  (disease) => disease.nome === dataCase["nome"]
                ).id;

                return diseaseCase;
              });

              debug(`depois ${data[0]}`);

              return Case.bulkCreate(data[0]);
            })
            .then(() => {
              res.status(201);
              res.send({ message: "Upload executado com sucesso." });
            })
            .catch((error) => {
              res.status(500);
              res.send(error);
            });
        });
    } else {
      res.status(422);
      res.send({ message: "Requisição inválida" });
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

    dictCase[csvRows[0][0]] = parseInt(csvRows[i][0]);
    dictCase[csvRows[0][2]] = parseInt(csvRows[i][2]);
    dictCase[csvRows[0][7]] = csvRows[i][7];

    for (let j = 1; j < 7; ++j) {
      if (isNaN(parseInt(csvRows[i][j]))) {
        dictCity[csvRows[0][j]] = csvRows[i][j];
      } else {
        dictCity[csvRows[0][j]] = parseFloat(csvRows[i][j]);
      }
    }
    for (let j = 7; j < 10; ++j) {
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

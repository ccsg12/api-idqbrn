const { exist } = require("joi");
const { isNull, parseInt, isNumber } = require("lodash");
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
          const data = csvNewParse(csvFile);

          data[1] = _.uniqBy(data[1], "codigoIBGE");
          data[2] = _.uniqBy(data[2], "nome");
          let cities = data[1];
          let diseases = data[2];

          //console.log(cities);
          City.bulkCreate(cities)
            .then((result) => {
              cities = result;
              //debug(cities);

              return Disease.bulkCreate(diseases);
            })
            .then((result) => {
              diseases = result;
             //debug(diseases);

              //debug(data[0]);

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

                //debug("id", doencaId)
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
              debug("Erro" + error)
              res.send(error);
            });
        });
    } else {
      res.status(422);
      res.send({ message: "Requisição inválida" });
    }
  };
};



const csvNewParse = function (csvFile) {
  const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
  const hexToUtf8 = convert("hex", "utf8");

  let csvData = hexToUtf8(csvFile.data).split("\r\n");
  let csvRows = [];
  csvData.forEach((data) => {
    csvRows.push(data.split(";"));
  });

  let data = [];
  let dataCase = [];
  let dataCity = [];
  let dataDisease = [];

  //DOENÇAS
  for( let j = 11; j<26; ++j){
    let dictDisease = {};

    dictDisease["nome"] = csvRows[0][j];
    dictDisease["prevencao"] = "";
    dictDisease["tratamento"] = "";

    dataDisease.push(dictDisease);
  }
  

  for (let i = 1; i <300; ++i) {
    let dictCase = {};
    let dictCity = {};
    
    if(!isNaN(parseInt(csvRows[i][2])) && !isNull(csvRows[i][1])){
      //CASOS
      for( let j = 11; j<26; ++j){
        if (parseInt(csvRows[i][j]) != 0 ){
            dictCase["nome"] = csvRows[0][j];
            dictCase["codigoIBGE"] = parseInt(csvRows[i][2]);
            dictCase["quantidade"] = parseInt(csvRows[i][j]);

            
        }
      }

      if(dictCase["nome"]){
        dataCase.push(dictCase);
      }
      //CIDADES
      dictCity["nome"] = csvRows[i][1];
      dictCity["codigoIBGE"] = parseInt(csvRows[i][2]);
      dictCity["latitude"] = parseFloat((csvRows[i][6]?.toString() || "").replace(",", "."));       //Troca "," por "."
      dictCity["longitude"] = parseFloat((csvRows[i][7]?.toString() || "").replace(",", "."));      //Troca "," por "."
      dictCity["populacao"] = parseInt(csvRows[i][9]);
      dictCity["estado"] = csvRows[i][0];

      dataCity.push(dictCity);
    }

  }

  data.push(dataCase);
  data.push(dataCity);
  data.push(dataDisease);

  console.log(dataCity)
  
  return data;
};
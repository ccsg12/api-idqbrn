const Case = require("../models/Case");
const { findAll, findOne } = require("../models/City");
const City = require("../models/City");
const _ = require("lodash");
const Disease = require("../models/Disease");

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
  bulk_create = async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      const cases = await Case.bulkCreate(data);
      res.send(cases);
    } catch (err) {
      res.send(err.message);
    }
  };
  csv_create = async (req, res) => {
    if (!req.files || !req.files.file) {
      res.status(404)
        .send('File not found');
    } else if (req.files.file.mimetype === 'text/csv') {
      let csvFile = req.files.file;
      const data = convert(csvFile);
      
      Case.destroy({
        truncate: true
      }).then(()=>{
      
      })

      data[1] = _.uniqBy(data[1], "codigoIBGE");
      data[2] = _.uniqBy(data[2], "nome");
      let cities = data[1];
      let diseases = data[2];
      
      const dbCities = await (await City.findAll({attributes:["codigoIBGE"]})).map(x=>x.codigoIBGE);
      const dbDiseases = await (await Disease.findAll({attributes:["nome"]})).map(x=>x.nome);
      
      if (dbCities.length>0) {
        console.log(data[1])
        console.log(dbCities,"dbCities");
          cities =  _.remove(data[1], function(value) { 
          return _.find(dbCities ,value.codigoIBGE); 
        });

      }
      if (dbDiseases.length>0) {
        console.log(dbDiseases,"dbCities");
        diseases =  _.remove(data[2], function(value) {
            return _.find(dbDiseases ,value.nome);
        });

        
      }

      console.log(cities);
      console.log(diseases);
      City.bulkCreate(cities).then( () => {
        Disease.bulkCreate(diseases) 
      }).then(()=>{
        Case.bulkCreate(data[0])
        
      }).then(()=>{
        res.status(201);
        res.send();
      }).catch(err => {
        console.log("sugou");
        res.send(err.message);
      })
    } else {
      res.status(422)
        .send(
          util.apiResponse(0, toast.INVALID_FILE_FORMAT, {
            err: 'File format is not valid',
          }),
        );
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
      const { cidadeId, doencaId } = req.params;

      
        const cases = await Case.findByPk(cidadeId);

        if (cases) {
          await Case.destroy({ where: { cidadeId, doencaId } });

          res.status(204);
          res.send();
        } else {
          res.status(404);
          res.send({ error: "Caso nao encontrado" });
        }
      
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };


  


  update = async (req, res) => {
    try {
      const {cidadeId, quantidade , doencaId } = req.body;

      
        let cases = await Case.findByPk(cidadeId);

        if (cases) {
          let caseDetails = {
            
            quantidade,
            
          };          

          await Case.update(caseDetails, { where: { cidadeId, doencaId} });
          await cases.reload();

          res.send(_.pick(cases, ["cidadeId", "quantidade","doencaId"]));
        } else {
          res.status(404);
          res.send({ error: "Caso não encontrado." });
        }
      
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };

  doenca_case = async (req,res) =>{
    try {
      const {doencaId} = req.params;

      
        const cases = await Case.findAll({where: {doencaId}});

          res.send(cases);
      
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  };
  
};

const convert = function (csvFile) {
  const convert = (from, to) => (str) => Buffer.from(str, from)
    .toString(to);
  const hexToUtf8 = convert('hex', 'utf8');
  let csvData = hexToUtf8(csvFile.data)
    .split('\r\n');
  console.log(csvData);
  let csvRows = [];
  csvData.forEach((data) => {
    csvRows.push(data.split(','));
  });
  let data =[];
  let dataCase = [];
  let dataCity = [];
  let dataDisease = [];
  for (let i = 1; i < csvRows.length; ++i) {
    let dictCase = {};
    let dictCity = {};
    let dictDisease = {};
    
    for (let j = 0; j < 3; ++j) {
      if (isNaN(parseInt(csvRows[i][j])))
      {
        dictCase[csvRows[0][j]] = csvRows[i][j];
      }
      else
      {
        dictCase[csvRows[0][j]] = parseInt(csvRows[i][j]);
      }
    }
    for (let j = 3; j < 9; ++j) {
      if (isNaN(parseInt(csvRows[i][j])))
      {
        dictCity[csvRows[0][j]] = csvRows[i][j];
      }
      else
      {
        dictCity[csvRows[0][j]] = parseFloat(csvRows[i][j]);
      }
    }
    for (let j = 9; j < 12; ++j) {
      if (isNaN(parseInt(csvRows[i][j])))
      {
        dictDisease[csvRows[0][j]] = csvRows[i][j];
      }
      else
      {
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
}

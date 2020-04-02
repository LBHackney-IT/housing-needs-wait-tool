require('dotenv').config();
const path = require('path');
const SqlServerConnection = require('./SqlServerConnection');
const dataFuncs = require('./Data');
const fetchHousingRegisterData = require('./use_cases/FetchHousingRegisterData')(
  {
    uhtGateway: require('./gateways/UHTGateway')({
      db: new SqlServerConnection({ dbUrl: process.env.UHT_DB })
    })
  }
);
const { loadTemplates } = require('./Utils');
const templates = loadTemplates(path.join(__dirname, '../templates'));

module.exports = {
  dataFuncs,
  fetchHousingRegisterData,
  templates
};

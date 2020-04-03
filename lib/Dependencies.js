require('dotenv').config();
const path = require('path');
const SqlServerConnection = require('./SqlServerConnection');
const dataFuncs = require('./Data');
const uhtGateway = require('./gateways/UHTGateway')({
  db: new SqlServerConnection({ dbUrl: process.env.UHT_DB })
});
const checkDob = require('./use_cases/CheckDob')({ uhtGateway });
const fetchHousingRegisterData = require('./use_cases/FetchHousingRegisterData')(
  { uhtGateway }
);
const { loadTemplates } = require('./Utils');
const templates = loadTemplates(path.join(__dirname, '../templates'));

module.exports = {
  checkDob,
  dataFuncs,
  fetchHousingRegisterData,
  templates
};

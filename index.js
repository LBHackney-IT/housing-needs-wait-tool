const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const {
  dataFuncs,
  fetchHousingRegisterData,
  templates
} = require('./lib/Dependencies');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));

app.get('/start', async (req, res) => {
  const token = jwt.sign({ valid: true }, process.env.jwtsecret);
  const html = templates.indexTemplate({
    title: 'this is the index',
    token
  });
  res.send(html);
});

app.post('/results', async (req, res) => {
  const token = jwt.verify(req.body.token, process.env.jwtsecret);
  if (!token || !token.valid) {
    res.sendStatus(401);
  }
  const data = await fetchHousingRegisterData(req.body.biddingNumber);
  const waitTimeData = dataFuncs.getWaitTimeData(data);
  const html = templates.resultsTemplate({
    title: 'this is the results',
    waitTimeData,
    whyIsThisData: dataFuncs.getWhyIsThisData(data),
    progressBarData: dataFuncs.getProgressBarData(data),
    isShort: waitTimeData.message === 'around 12 months',
    yourApplicationData: dataFuncs.getYourApplicationData(data, dataFuncs.bands)
  });
  res.send(html);
});

module.exports = {
  handler: serverless(app)
};

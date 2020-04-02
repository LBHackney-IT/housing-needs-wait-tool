const jwt = require('jsonwebtoken');
const api = require('lambda-api')();

const {
  dataFuncs,
  fetchHousingRegisterData,
  templates
} = require('./lib/Dependencies');

api.get('/css/:filename', async (req, res) => {
  res.sendFile(req.params.filename, {
    root: 'static/css/'
  });
});

api.get('/img/:filename', async (req, res) => {
  res.sendFile(req.params.filename, {
    root: 'static/img/'
  });
});

api.get('/start', async (req, res) => {
  const token = jwt.sign({ valid: true }, process.env.jwtsecret);
  const html = templates.indexTemplate({
    title: 'this is the index',
    token
  });
  res.html(html);
});

api.post('/results', async (req, res) => {
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
  res.html(html);
});

module.exports = {
  handler: async (event, context) => {
    return await api.run(event, context);
  }
};

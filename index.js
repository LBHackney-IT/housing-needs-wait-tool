const jwt = require('jsonwebtoken');
const api = require('lambda-api')();

const {
  checkDob,
  dataFuncs,
  fetchHousingRegisterData,
  templates
} = require('./lib/Dependencies');

const hasOptInCookie = ({ cookies }) => cookies['cookie_opt_in'] === true;

api.get('/css/:filename', async (req, res) => {
  res.sendFile(req.params.filename, {
    root: 'static/css/'
  });
});

api.get('/js/:filename', async (req, res) => {
  res.sendFile(req.params.filename, {
    root: 'static/js/'
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
    title: 'Housing Register Wait Time Search',
    cookieOptIn: hasOptInCookie(req),
    token
  });
  res.html(html);
});

api.post('/results', async (req, res) => {
  const token = jwt.verify(req.body.token, process.env.jwtsecret);
  if (!token || !token.valid) {
    return res.sendStatus(401);
  }

  const dobValid = await checkDob(
    req.body.biddingNumber,
    `${req.body.day}/${req.body.month}/${req.body.year}`
  );
  if (dobValid) {
    const data = await fetchHousingRegisterData(req.body.biddingNumber);
    if (data) {
      const waitTimeData = dataFuncs.getWaitTimeData(data);
      const html = templates.resultsTemplate({
        title: 'Housing Register Wait Time Results',
        cookieOptIn: hasOptInCookie(req),
        waitTimeData,
        whyIsThisData: dataFuncs.getWhyIsThisData(data),
        progressBarData: dataFuncs.getProgressBarData(data),
        isShort: waitTimeData.message === 'around 12 months',
        yourApplicationData: dataFuncs.getYourApplicationData(
          data,
          dataFuncs.bands
        )
      });
      return res.html(html);
    }
  }

  res.redirect('/notfound');
});

api.get('/notfound', async (req, res) => {
  const html = templates.notfoundTemplate({
    title: 'Housing Register Wait Time',
    cookieOptIn: hasOptInCookie(req)
  });
  res.html(html);
});

module.exports = {
  handler: async (event, context) => {
    return await api.run(event, context);
  }
};

const express = require('express');
const bodyParser = require('body-parser');
const apiRoute = require('./src/routes/api.route');

const app = express();

app.use(bodyParser.json());
app.use('/api', apiRoute);

app.use('/', (req, res) => {
  res.status(200).json({
    message: '✅ Base route reached — Server is up and running smoothly!',
  });
});

module.exports = app;

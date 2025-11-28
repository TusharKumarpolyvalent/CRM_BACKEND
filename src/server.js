const express = require('express');
const bodyParser = require('body-parser');
const AdminRouter = require('./routes/admin.route');
const AgentRouter = require('./routes/agent.route');

const app = express();

app.use(bodyParser.json());

app.use('/admin', AdminRouter);
app.use('/agent', AgentRouter);

app.use('/', (req, res) => {
  res.status(200).json({
    message: '✅ Base route reached — Server is up and running smoothly!',
  });
});

module.exports = app;

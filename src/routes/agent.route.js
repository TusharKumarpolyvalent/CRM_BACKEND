const express = require('express');
const { fetchAgentLeads } = require('../controllers/Agent.controller');

const AgentRouter = express.Router();

AgentRouter.get('/get-leads', fetchAgentLeads);
AgentRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ AGENT base route reached — Agent API is functioning correctly!',
  });
});

module.exports = AgentRouter;

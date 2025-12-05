const express = require('express');
const {
  fetchAgentLeads,
  leadFollowUp,
  addLeadRecord,
} = require('../controllers/Agent.controller');

const AgentRouter = express.Router();

AgentRouter.get('/get-Leads', fetchAgentLeads);
AgentRouter.post('/follow-up/:leadId', leadFollowUp);
AgentRouter.post('/leadrecord/:leadId', addLeadRecord);

AgentRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ AGENT base route reached — Agent API is functioning correctly!',
  });
});

module.exports = AgentRouter;

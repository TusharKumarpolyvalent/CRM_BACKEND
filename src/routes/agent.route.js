const express = require('express');
const {
  fetchAgentLeads,
  leadFollowUp,
  addLeadRecord,
  updateLeadDetails,
  updateLeadAddress,
  dailyCallCount,
} = require('../controllers/Agent.controller');

const AgentRouter = express.Router();

AgentRouter.get('/get-leads', fetchAgentLeads);
AgentRouter.post('/follow-up/:leadId', leadFollowUp);
AgentRouter.post('/leadrecord/:leadId', addLeadRecord);
AgentRouter.patch('/update-lead/:leadId', updateLeadDetails);
AgentRouter.patch('/update-lead-address/:leadId', updateLeadAddress);
AgentRouter.get('/daily-call-count', dailyCallCount);

AgentRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ AGENT base route reached — Agent API is functioning correctly!',
  });
});

module.exports = AgentRouter;

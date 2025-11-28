const express = require('express');

const AgentRouter = express.Router();

AgentRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ AGENT base route reached — Agent API is functioning correctly!',
  });
});

module.exports = AgentRouter;

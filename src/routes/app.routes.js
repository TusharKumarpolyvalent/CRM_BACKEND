const express = require('express');
const router = express.Router();
const { getAppLead } = require('../controllers/App.controller');

router.get('/lead-app/:agentId', getAppLead);
console.log('App Routes Loaded');

module.exports = router;

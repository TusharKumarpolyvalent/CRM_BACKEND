const express = require('express');
const { addCampaign } = require('../controllers/Admin.controller');

const AdminRouter = express.Router();

AdminRouter.post('/add-campaign', addCampaign);

AdminRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ ADMIN base route reached — Admin API is functioning correctly!',
  });
});

module.exports = AdminRouter;

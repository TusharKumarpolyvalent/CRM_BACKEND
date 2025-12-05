const express = require('express');
const multer = require('multer');
const {
  addCampaign,
  getCampaign,
  addLeads,
  getLeads,
  importLeads,
  addUser,
  getUser,
  assignAgent,
} = require('../controllers/Admin.controller');

const AdminRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

AdminRouter.post('/add-campaign', addCampaign);
AdminRouter.get('/get-campaigns', getCampaign);
AdminRouter.post('/add-leads', addLeads);
AdminRouter.post('/import-leads', upload.single('file'), importLeads);
AdminRouter.get('/get-leads', getLeads);
AdminRouter.post('/add-user', addUser);
AdminRouter.get('/get-user/:role', getUser);
AdminRouter.post('/assign/:agentId', assignAgent);

AdminRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ ADMIN base route reached — Admin API is functioning correctly!',
  });
});

module.exports = AdminRouter;

const express = require('express');
const { addActivity } = require('../controllers/Activity.controller');

const ActivityRouter = express.Router();

ActivityRouter.post('/add', addActivity);
ActivityRouter.use('/', (req, res) => {
  res.status(200).json({
    message:
      '✅ Activity base route reached — Activity API is functioning correctly!',
  });
});
module.exports = ActivityRouter;

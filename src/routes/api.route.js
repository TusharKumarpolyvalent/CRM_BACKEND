const express = require('express');
const userRoute = require('./user.route');

const apiRoute = express.Router();

apiRoute.use('/user', userRoute);

apiRoute.use('/', (req, res) => {
  res.status(200).json({
    message: '✅ API base route reached — API is functioning correctly!',
  });
});

module.exports = apiRoute;

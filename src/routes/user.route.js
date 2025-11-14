const express = require('express');
const { createUser } = require('../controllers/user.controller');

const userRoute = express.Router();

userRoute.post('/add', createUser);
userRoute.get('/get', (req, res) => {
  res.send('User route is working!');
});

module.exports = userRoute;

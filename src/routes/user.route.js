const express = require('express');
const { addUser } = require('../controllers/user.controller');

const userRoute = express.Router();

userRoute.post('/add', addUser);
userRoute.get('/get', (req, res) => {
  res.send('User route is working!');
});

module.exports = userRoute;

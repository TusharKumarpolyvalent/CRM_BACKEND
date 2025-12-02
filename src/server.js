const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const AdminRouter = require('./routes/admin.route');
const AgentRouter = require('./routes/agent.route');
const { userLogin } = require('./controllers/Auth.controller');

const app = express();

// ======= CORS CONFIGURATION =======
app.use(
  cors({
    origin: 'http://localhost:5173', // allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // include custom headers if needed
  })
);

// ======= MIDDLEWARE =======
app.use(bodyParser.json());

// ======= ROUTES =======
app.use('/admin', AdminRouter);
app.use('/agent', AgentRouter);

app.post('/login', userLogin);

app.use('/', (req, res) => {
  res.status(200).json({
    message: '✅ Base route reached — Server is up and running smoothly!',
  });
});

// ======= EXPORT APP =======
module.exports = app;

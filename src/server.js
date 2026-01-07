const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const AdminRouter = require('./routes/admin.route');
const AgentRouter = require('./routes/agent.route');
const { userLogin } = require('./controllers/Auth.controller');
const ActivityRouter = require('./routes/Activity.route');

const app = express();

// ======= CORS CONFIGURATION (FIRST) =======
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// THIS LINE FIXES PATCH ISSUE
// app.options("*", cors());

// ======= MIDDLEWARE =======
app.use(bodyParser.json());

// ======= ROUTES =======
app.use('/api/admin', AdminRouter);
app.use('/api/agent', AgentRouter);

app.post('/api/login', userLogin);
app.use('/api/activity', ActivityRouter);

app.use('/', (req, res) => {
  res.status(200).json({
    message: '✅ Base route reached — Server is up and running smoothly!',
  });
});

module.exports = app;

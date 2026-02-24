const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const verifyToken = require('./middleware/verifyToken');
const AdminRouter = require('./routes/admin.route');
const AgentRouter = require('./routes/agent.route');
const { userLogin } = require('./controllers/Auth.controller');
const ActivityRouter = require('./routes/Activity.route');
const AppRouter = require('./routes/app.routes');

const app = express();
app.use(cors());
// ======= CORS CONFIGURATION (FIRST) =======
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// THIS LINE FIXES PATCH ISSUE
// app.options("/", cors());

// ======= MIDDLEWARE =======
app.use(bodyParser.json());

// ======= ROUTES =======

app.post('/api/login', userLogin);
app.use('/api/admin', verifyToken, AdminRouter);
app.use('/api/agent', verifyToken, AgentRouter);
app.use('/api/app', AppRouter);
app.get('/test', (req, res) => {
  res.send('Test route working');
});
app.use('/api/activity', verifyToken, ActivityRouter);

app.use('/', (req, res) => {
  res.status(200).json({
    message: '✅ Base route reached — Server is up and running smoothly!',
  });
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:7891', 'https://geo-tone-staging.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// ROUTES
app.use('/api/v1/projects', require('./controllers/projects'));
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/profiles', require('./controllers/profiles'));

// ERROR & 404 MIDDLEWARE
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

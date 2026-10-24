const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');


const env = require('./config/env');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const logger = require('./utils/logger');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Sanitize against NoSQL injection
app.use(mongoSanitize());

// Request logging
if (env.env !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Global rate limiting
app.use('/api', apiLimiter);

// API routes
app.use('/api', routes);

// Root
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CodeView AI API',
    docs: '/api/health',
  });
});

// 404 + error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
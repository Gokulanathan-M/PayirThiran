const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const suitabilityRoutes = require('./routes/suitabilityRoutes');
const landRoutes = require('./routes/landRoutes');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/suitability', suitabilityRoutes);
app.use('/api/lands', landRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

module.exports = app;

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/crop_recommendation',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  weatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  geocodingApiKey: process.env.GEOCODING_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/soil-images',
};

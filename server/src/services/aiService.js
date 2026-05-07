const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config');
const logger = require('../utils/logger');

const aiClient = axios.create({
  baseURL: config.aiServiceUrl,
  timeout: 30000,
});

/**
 * Call the AI service /predict endpoint for crop recommendation.
 */
exports.predictCrops = async (payload) => {
  try {
    const form = new FormData();

    // Scalar fields
    const fields = [
      'soilType', 'soilPH', 'temperature', 'humidity', 'rainfall',
      'irrigation', 'soilMoisture', 'previousCrop', 'season',
      'landSize', 'investmentAmount',
    ];
    fields.forEach(f => {
      if (payload[f] != null) form.append(f, String(payload[f]));
    });

    // Soil image
    if (payload.soilImagePath && fs.existsSync(payload.soilImagePath)) {
      form.append('soilImage', fs.createReadStream(payload.soilImagePath));
    }

    const { data } = await aiClient.post('/predict', form, {
      headers: form.getHeaders(),
    });
    return data;
  } catch (err) {
    logger.error(`AI predict failed: ${err.message}`);
    throw err;
  }
};

/**
 * Call the AI service /suitability endpoint.
 */
exports.checkSuitability = async (payload) => {
  try {
    const form = new FormData();
    const fields = ['cropName', 'soilType', 'soilPH', 'temperature', 'humidity', 'rainfall', 'landSize', 'season'];
    fields.forEach(f => {
      if (payload[f] != null) form.append(f, String(payload[f]));
    });

    if (payload.soilImagePath && fs.existsSync(payload.soilImagePath)) {
      form.append('soilImage', fs.createReadStream(payload.soilImagePath));
    }

    const { data } = await aiClient.post('/suitability', form, {
      headers: form.getHeaders(),
    });
    return data;
  } catch (err) {
    logger.error(`AI suitability failed: ${err.message}`);
    throw err;
  }
};

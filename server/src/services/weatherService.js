const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Fetch current weather data from OpenWeatherMap by location string.
 * Returns { temperature, humidity, rainfall } or null on failure.
 */
exports.getWeather = async (location) => {
  if (!config.weatherApiKey || !location) return null;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const { data } = await axios.get(url, {
      params: { q: location, appid: config.weatherApiKey, units: 'metric' },
      timeout: 5000,
    });

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] || data.rain?.['3h'] || 0,
    };
  } catch (err) {
    logger.warn(`Weather API failed for "${location}": ${err.message}`);
    return null;
  }
};

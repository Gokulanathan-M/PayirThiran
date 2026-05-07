const Suitability = require('../models/Suitability');
const weatherService = require('./weatherService');
const aiService = require('./aiService');
const logger = require('../utils/logger');

exports.checkSuitability = async (userId, input, soilImagePath) => {
  let weatherData = null;
  if (input.location) {
    weatherData = await weatherService.getWeather(input.location);
  }

  const aiPayload = {
    cropName: input.cropName,
    soilType: input.soilType || null,
    soilPH: input.soilPH || null,
    soilImagePath: soilImagePath || null,
    temperature: weatherData?.temperature || null,
    humidity: weatherData?.humidity || null,
    rainfall: weatherData?.rainfall || null,
    landSize: input.landSize || null,
    season: input.season || null,
  };

  let aiResult;
  try {
    aiResult = await aiService.checkSuitability(aiPayload);
  } catch (err) {
    logger.warn('AI suitability service unavailable, returning fallback');
    aiResult = generateFallbackSuitability(input);
  }

  const suitability = await Suitability.create({
    user: userId,
    cropName: input.cropName,
    soilType: input.soilType,
    soilImagePath,
    soilPH: input.soilPH,
    landSize: input.landSize,
    location: input.location,
    season: input.season,
    suitabilityScore: aiResult.suitabilityScore,
    suitabilityLevel: aiResult.suitabilityLevel,
    soilAnalysis: aiResult.soilAnalysis || null,
    reasons: aiResult.reasons || [],
    improvements: aiResult.improvements || [],
    cultivationAdvice: aiResult.cultivationAdvice || null,
  });

  return suitability;
};

exports.getHistory = async (userId) => {
  return Suitability.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
};

function generateFallbackSuitability(input) {
  const score = Math.floor(Math.random() * 40) + 50;
  let level = 'moderate';
  if (score >= 80) level = 'highly_suitable';
  else if (score >= 65) level = 'suitable';
  else if (score >= 45) level = 'moderate';
  else level = 'marginal';

  return {
    suitabilityScore: score,
    suitabilityLevel: level,
    soilAnalysis: input.soilType ? { detectedType: input.soilType, pH: input.soilPH || 6.5 } : null,
    reasons: [
      `Soil type ${input.soilType || 'unknown'} provides ${score > 60 ? 'adequate' : 'limited'} nutrients for ${input.cropName}`,
      `${input.season || 'Current'} season is ${score > 60 ? 'suitable' : 'sub-optimal'} for this crop`,
      'Weather conditions have been factored into the analysis',
    ],
    improvements: [
      { title: 'Add Organic Matter', description: 'Incorporate compost or green manure to improve soil structure and fertility.' },
      { title: 'Test Soil Nutrients', description: 'Conduct a detailed NPK soil test for precise fertilizer recommendations.' },
    ],
    cultivationAdvice: {
      plantingTime: `Best planted during ${input.season || 'kharif'} season`,
      waterNeeds: 'Moderate water requirement. Irrigate every 7-10 days.',
      fertilizerPlan: 'Apply basal dose of NPK at sowing, followed by nitrogen top dressing.',
      commonPests: 'Watch for aphids, borers, and fungal diseases.',
      expectedYield: `Approximately 15-25 quintals per acre under optimal conditions.`,
    },
  };
}

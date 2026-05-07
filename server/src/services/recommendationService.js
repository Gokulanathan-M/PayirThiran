const Recommendation = require('../models/Recommendation');
const weatherService = require('./weatherService');
const aiService = require('./aiService');
const logger = require('../utils/logger');

exports.getRecommendation = async (userId, input, soilImagePath) => {
  // 1. Fetch weather data if location provided
  let weatherData = null;
  if (input.location) {
    weatherData = await weatherService.getWeather(input.location);
  }

  // 2. Build AI payload
  const aiPayload = {
    soilType: input.soilType || null,
    soilPH: input.soilPH || null,
    soilImagePath: soilImagePath || null,
    temperature: weatherData?.temperature || null,
    humidity: weatherData?.humidity || null,
    rainfall: weatherData?.rainfall || null,
    irrigation: input.irrigation || null,
    soilMoisture: input.soilMoisture || null,
    previousCrop: input.previousCrop || null,
    season: input.season || null,
    landSize: input.landSize || null,
    investmentAmount: input.investmentAmount || null,
  };

  // 3. Call AI service
  let aiResult;
  try {
    aiResult = await aiService.predictCrops(aiPayload);
  } catch (err) {
    logger.warn('AI service unavailable, returning placeholder recommendations');
    aiResult = generateFallbackRecommendation(input);
  }

  // 4. Save to database
  const recommendation = await Recommendation.create({
    user: userId,
    landSize: input.landSize,
    landUnit: input.landUnit,
    location: input.location,
    soilType: input.soilType,
    soilImagePath,
    soilPH: input.soilPH,
    irrigation: input.irrigation,
    soilMoisture: input.soilMoisture,
    previousCrop: input.previousCrop,
    season: input.season,
    investmentAmount: input.investmentAmount,
    crops: aiResult.crops || [],
    soilAnalysis: aiResult.soilAnalysis || null,
    weatherData: weatherData || null,
  });

  return recommendation;
};

exports.getHistory = async (userId) => {
  return Recommendation.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
};

function generateFallbackRecommendation(input) {
  const season = input.season || 'kharif';
  const cropMap = {
    kharif: ['Rice', 'Cotton', 'Soybean'],
    rabi: ['Wheat', 'Mustard', 'Chickpea'],
    zaid: ['Watermelon', 'Cucumber', 'Moong'],
    summer: ['Sunflower', 'Groundnut', 'Sesame'],
    winter: ['Wheat', 'Peas', 'Lentil'],
  };
  const crops = (cropMap[season] || cropMap.kharif).map((name, i) => ({
    cropName: name,
    confidence: 85 - i * 10,
    season,
    sustainabilityScore: i === 0 ? 'high' : 'medium',
    estimatedInvestment: (input.investmentAmount || 50000) * (0.3 + i * 0.1),
    estimatedRevenue: (input.investmentAmount || 50000) * (0.6 + (2 - i) * 0.2),
    roi: Math.round(((0.6 + (2 - i) * 0.2) / (0.3 + i * 0.1) - 1) * 100),
    fertilizers: [
      { name: 'DAP', dosage: '50 kg/acre', timing: 'At sowing', notes: 'Mix well with soil' },
      { name: 'Urea', dosage: '30 kg/acre', timing: '30 days after sowing', notes: 'Top dressing' },
    ],
    cultivationGuide: {
      landPreparation: `Plough the field 2-3 times and level it properly for ${name} cultivation.`,
      sowing: `Sow ${name} seeds at recommended spacing during ${season} season.`,
      irrigation: 'Irrigate at critical growth stages. Avoid waterlogging.',
      pestManagement: 'Monitor regularly for pests. Use integrated pest management.',
      harvesting: `Harvest when the crop reaches maturity, typically indicated by color change.`,
    },
    growthTips: [
      'Ensure proper seed treatment before sowing',
      'Maintain optimal plant spacing for better yield',
      'Apply fertilizers based on soil test results',
    ],
  }));

  return { crops, soilAnalysis: null };
}

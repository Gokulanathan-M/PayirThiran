const mongoose = require('mongoose');

const cropResultSchema = new mongoose.Schema({
  cropName: String,
  confidence: Number,
  season: String,
  sustainabilityScore: String,
  estimatedInvestment: Number,
  estimatedRevenue: Number,
  roi: Number,
  fertilizers: [{
    name: String,
    dosage: String,
    timing: String,
    notes: String,
  }],
  cultivationGuide: {
    landPreparation: String,
    sowing: String,
    irrigation: String,
    pestManagement: String,
    harvesting: String,
  },
  growthTips: [String],
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Input data
  landSize: Number,
  landUnit: String,
  location: String,
  soilType: String,
  soilImagePath: String,
  soilPH: Number,
  irrigation: String,
  soilMoisture: String,
  previousCrop: String,
  season: String,
  investmentAmount: Number,
  // Results
  crops: [cropResultSchema],
  soilAnalysis: {
    detectedType: String,
    pH: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
  },
  weatherData: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
  },
}, { timestamps: true });

recommendationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);

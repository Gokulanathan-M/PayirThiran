const mongoose = require('mongoose');

const suitabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Input
  cropName: { type: String, required: true },
  soilType: String,
  soilImagePath: String,
  soilPH: Number,
  landSize: Number,
  location: String,
  season: String,
  // Results
  suitabilityScore: Number,
  suitabilityLevel: { type: String, enum: ['highly_suitable', 'suitable', 'moderate', 'marginal', 'not_suitable'] },
  soilAnalysis: {
    detectedType: String,
    pH: Number,
  },
  reasons: [String],
  improvements: [{
    title: String,
    description: String,
  }],
  cultivationAdvice: {
    plantingTime: String,
    waterNeeds: String,
    fertilizerPlan: String,
    commonPests: String,
    expectedYield: String,
  },
}, { timestamps: true });

suitabilitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Suitability', suitabilitySchema);

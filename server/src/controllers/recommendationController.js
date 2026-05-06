const recommendationService = require('../services/recommendationService');

exports.getRecommendation = async (req, res, next) => {
  try {
    const soilImagePath = req.file?.path || null;
    const input = {
      landSize: req.body.landSize,
      landUnit: req.body.landUnit,
      location: req.body.location,
      soilType: req.body.soilType,
      soilPH: req.body.soilPH,
      irrigation: req.body.irrigation,
      soilMoisture: req.body.soilMoisture,
      previousCrop: req.body.previousCrop,
      season: req.body.season,
      investmentAmount: req.body.investmentAmount,
    };
    const recommendation = await recommendationService.getRecommendation(req.user._id, input, soilImagePath);
    res.status(201).json({ success: true, recommendation });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await recommendationService.getHistory(req.user._id);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

const suitabilityService = require('../services/suitabilityService');

exports.checkSuitability = async (req, res, next) => {
  try {
    const soilImagePath = req.file?.path || null;
    const input = {
      cropName: req.body.cropName,
      soilType: req.body.soilType,
      soilPH: req.body.soilPH,
      landSize: req.body.landSize,
      location: req.body.location,
      season: req.body.season,
    };
    const suitability = await suitabilityService.checkSuitability(req.user._id, input, soilImagePath);
    res.status(201).json({ success: true, suitability });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await suitabilityService.getHistory(req.user._id);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

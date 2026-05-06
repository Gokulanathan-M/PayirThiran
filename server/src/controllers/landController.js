const Land = require('../models/Land');

exports.getLands = async (req, res, next) => {
  try {
    const lands = await Land.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, lands });
  } catch (err) {
    next(err);
  }
};

exports.createLand = async (req, res, next) => {
  try {
    const land = await Land.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, land });
  } catch (err) {
    next(err);
  }
};

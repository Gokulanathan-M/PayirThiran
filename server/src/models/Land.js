const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  landSize: { type: Number },
  landUnit: { type: String, default: 'acres' },
  location: { type: String },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  soilType: { type: String },
  soilPH: { type: Number },
}, { timestamps: true });

landSchema.index({ user: 1 });

module.exports = mongoose.model('Land', landSchema);

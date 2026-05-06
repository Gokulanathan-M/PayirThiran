// Soil types
export const SOIL_TYPES = [
  { value: 'sandy', label: 'Sandy Soil' },
  { value: 'clay', label: 'Clay Soil' },
  { value: 'loamy', label: 'Loamy Soil' },
  { value: 'red', label: 'Red Soil' },
  { value: 'black', label: 'Black Soil' },
  { value: 'unknown', label: 'Unknown' },
];

// Land size units
export const LAND_UNITS = [
  { value: 'acre', label: 'Acre' },
  { value: 'cent', label: 'Cent' },
];

// Seasons
export const SEASONS = [
  { value: 'kharif', label: 'Kharif (Jun-Oct)' },
  { value: 'rabi', label: 'Rabi (Nov-Mar)' },
  { value: 'zaid', label: 'Zaid (Mar-Jun)' },
  { value: 'summer', label: 'Summer' },
  { value: 'winter', label: 'Winter' },
];

// Common crops
export const CROPS = [
  { value: 'rice', label: 'Rice' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'maize', label: 'Maize' },
  { value: 'groundnut', label: 'Groundnut' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'sugarcane', label: 'Sugarcane' },
  { value: 'soybean', label: 'Soybean' },
  { value: 'sunflower', label: 'Sunflower' },
  { value: 'millets', label: 'Millets' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'none', label: 'None (First crop)' },
];

// Soil moisture levels
export const MOISTURE_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

// Suitability levels
export const SUITABILITY_LEVELS = {
  HIGH: { min: 80, label: 'Highly Suitable', color: 'text-green-600', bg: 'bg-green-100' },
  MODERATE: { min: 60, label: 'Moderately Suitable', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  LOW: { min: 0, label: 'Not Recommended', color: 'text-red-600', bg: 'bg-red-100' },
};

export const getSuitabilityLevel = (percent) => {
  if (percent >= 80) return SUITABILITY_LEVELS.HIGH;
  if (percent >= 60) return SUITABILITY_LEVELS.MODERATE;
  return SUITABILITY_LEVELS.LOW;
};

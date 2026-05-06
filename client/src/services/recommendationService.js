import api from './api';

export const recommendationService = {
  getRecommendation(formData) {
    const payload = new FormData();
    const { land, soil, environment, cropHistory, financial } = formData;

    // Land info
    if (land) {
      if (land.size) payload.append('landSize', land.size);
      if (land.unit) payload.append('landUnit', land.unit);
      if (land.location) payload.append('location', land.location);
    }

    // Soil info
    if (soil) {
      if (soil.soilType) payload.append('soilType', soil.soilType);
      if (soil.soilImage) payload.append('soilImage', soil.soilImage);
      if (soil.soilPH) payload.append('soilPH', soil.soilPH);
    }

    // Environment
    if (environment) {
      if (environment.irrigation) payload.append('irrigation', environment.irrigation);
      if (environment.soilMoisture) payload.append('soilMoisture', environment.soilMoisture);
    }

    // Crop history
    if (cropHistory) {
      if (cropHistory.previousCrop) payload.append('previousCrop', cropHistory.previousCrop);
      if (cropHistory.season) payload.append('season', cropHistory.season);
    }

    // Financial
    if (financial) {
      if (financial.investmentAmount) payload.append('investmentAmount', financial.investmentAmount);
    }

    return api.post('/recommendations', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getHistory() {
    return api.get('/recommendations/history');
  },
};

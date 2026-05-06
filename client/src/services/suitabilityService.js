import api from './api';

export const suitabilityService = {
  checkSuitability(formData) {
    const payload = new FormData();
    if (formData.cropName) payload.append('cropName', formData.cropName);
    if (formData.soilType) payload.append('soilType', formData.soilType);
    if (formData.soilImage) payload.append('soilImage', formData.soilImage);
    if (formData.soilPH) payload.append('soilPH', formData.soilPH);
    if (formData.landSize) payload.append('landSize', formData.landSize);
    if (formData.location) payload.append('location', formData.location);
    if (formData.season) payload.append('season', formData.season);

    return api.post('/suitability', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getHistory() {
    return api.get('/suitability/history');
  },
};

import api from './api';

export const profileService = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getLands: () => api.get('/lands'),
  createLand: (data) => api.post('/lands', data),
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => password && password.length >= 8;

export const validateRequired = (value) => value !== undefined && value !== null && value !== '';

export const validatePositiveNumber = (value) => !isNaN(value) && Number(value) > 0;

export const validateSoilInput = (soilType, soilImage) => {
  return (soilType && soilType !== '') || soilImage !== null;
};

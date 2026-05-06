const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg).join('. ');
    return next(new AppError(messages, 400));
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidation,
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

module.exports = { registerRules, loginRules, handleValidation };

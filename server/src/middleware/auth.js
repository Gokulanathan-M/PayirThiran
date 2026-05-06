const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const auth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) throw new AppError('Not authenticated', 401);

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('User no longer exists', 401);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token', 401));
    if (err.name === 'TokenExpiredError') return next(new AppError('Token expired', 401));
    next(err);
  }
};

module.exports = auth;

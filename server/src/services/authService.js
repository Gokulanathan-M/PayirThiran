const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const AppError = require('../utils/AppError');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpire });

exports.register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already registered', 409);

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  return { user, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = generateToken(user._id);
  return { user, token };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

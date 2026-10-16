const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { signAccess, signRefresh } = require('../utils/tokens');

const tokensFor = (user) => ({ access: signAccess(user), refresh: signRefresh(user) });
// Only send safe fields back (never the password hash)
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });

// POST /api/auth/register/
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, message: 'Registration successful', user: publicUser(user), tokens: tokensFor(user) });
};

// POST /api/auth/login/
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) throw ApiError.unauthorized('Invalid email or password');
  res.json({ success: true, message: 'Login successful', user: publicUser(user), tokens: tokensFor(user) });
};

// POST /api/auth/refresh/  - swap a refresh token for a new access token
exports.refresh = async (req, res) => {
  let payload;
  try {
    payload = jwt.verify(req.body.refresh, env.jwt.refreshSecret);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  res.json({ success: true, tokens: { access: signAccess(user) } });
};

// GET /api/auth/me/
exports.me = async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
};

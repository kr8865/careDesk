const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAccess = (user) => jwt.sign({ sub: user.id, email: user.email, type: 'access' }, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });
const signRefresh = (user) => jwt.sign({ sub: user.id, type: 'refresh' }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

module.exports = { signAccess, signRefresh };

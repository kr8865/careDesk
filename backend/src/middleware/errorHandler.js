const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const notFound = (req, res, next) => next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));

// Readable messages for MongoDB duplicate-key errors (unique indexes)
const duplicateMessage = (err) => {
  const msg = err.message || '';
  if (msg.includes('unique_patient_doctor')) return 'This doctor is already assigned to this patient';
  if (msg.includes('doctors')) return 'A doctor with this email already exists';
  if (msg.includes('users')) return 'An account with this email already exists';
  return 'Duplicate value';
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let { details } = err;

  if (err.code === 11000) {
    status = 409;
    message = duplicateMessage(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON';
  }

  if (status >= 500) {
    console.error(err);
    if (env.nodeEnv === 'production') message = 'Internal server error';
  }

  res.status(status).json({ success: false, message, ...(details && { errors: details }) });
};

module.exports = { notFound, errorHandler };

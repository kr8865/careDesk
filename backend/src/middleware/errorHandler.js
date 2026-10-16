const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500;
  let message = err.message;

  // Duplicate value on a unique index (email, or the same patient + doctor pair)
  if (err.code === 11000) {
    status = 409;
    message = err.keyPattern?.patientId ? 'This doctor is already assigned to this patient' : 'This email is already in use';
  }

  if (status === 500) {
    console.error(err);
    message = 'Something went wrong';
  }
  res.status(status).json({ success: false, message, errors: err.details });
};

module.exports = { notFound, errorHandler };

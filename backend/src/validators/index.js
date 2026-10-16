const { body, param } = require('express-validator');

// MongoDB ids are 24-character hex strings (ObjectId)
const idParam = (name = 'id') => param(name).isMongoId().withMessage(`${name} is not a valid id`);

const register = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name is too long'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
    .matches(/\d/).withMessage('Password must contain a number'),
];

const login = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail({ gmail_remove_dots: false }),
  body('password').notEmpty().withMessage('Password is required'),
];

const refresh = [body('refresh').notEmpty().withMessage('Refresh token is required')];

// For PUT we validate the same fields; `optional` lets partial updates through
const patient = (isUpdate = false) => {
  const req = (chain) => (isUpdate ? chain.optional() : chain);
  return [
    req(body('name')).trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    req(body('age')).isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150').toInt(),
    req(body('gender')).isIn(['male', 'female', 'other']).withMessage('Gender must be male, female or other'),
    body('phone').optional({ values: 'falsy' }).trim().matches(/^[+\d][\d\s-]{6,19}$/).withMessage('Phone number is not valid'),
    body('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('Email is not valid'),
    body('address').optional({ values: 'null' }).isString().trim(),
    body('medicalHistory').optional({ values: 'null' }).isString().trim(),
  ];
};

const doctor = (isUpdate = false) => {
  const req = (chain) => (isUpdate ? chain.optional() : chain);
  return [
    req(body('name')).trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    req(body('specialization')).trim().notEmpty().withMessage('Specialization is required').isLength({ max: 100 }),
    req(body('email')).trim().isEmail().withMessage('A valid email is required'),
    body('phone').optional({ values: 'falsy' }).trim().matches(/^[+\d][\d\s-]{6,19}$/).withMessage('Phone number is not valid'),
    body('experienceYears').optional({ values: 'null' }).isInt({ min: 0, max: 70 }).withMessage('Experience must be 0-70 years').toInt(),
  ];
};

const mapping = [
  body('patientId').isMongoId().withMessage('patientId is not a valid id'),
  body('doctorId').isMongoId().withMessage('doctorId is not a valid id'),
  body('notes').optional({ values: 'null' }).isString().trim(),
];

module.exports = { idParam, register, login, refresh, patient, doctor, mapping };

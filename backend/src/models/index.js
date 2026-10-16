const mongoose = require('mongoose');

// Adds `id` to every JSON response (the frontend uses it). Must run before the models below are created.
mongoose.set('toJSON', { virtuals: true });

const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

module.exports = { User, Patient, Doctor, Mapping };

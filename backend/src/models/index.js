const { mongoose } = require('../config/db');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

// Relationships (MongoDB has no foreign keys, so deletes are cascaded in the controllers):
//   User 1 -> many Patients, Doctors   (createdBy)
//   Patient many <-> many Doctor        (through Mapping: patientId, doctorId)

module.exports = { mongoose, User, Patient, Doctor, Mapping };

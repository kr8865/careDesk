const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  age: { type: Number, required: true, min: 0, max: 150 },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  phone: { type: String, trim: true, maxlength: 20, default: null },
  email: { type: String, trim: true, lowercase: true, maxlength: 255, default: null },
  address: { type: String, default: null },
  medicalHistory: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);

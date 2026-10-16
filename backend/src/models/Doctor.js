const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  specialization: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 255,
    match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
  },
  phone: { type: String, trim: true, maxlength: 20, default: null },
  experienceYears: { type: Number, default: 0, min: 0, max: 70 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);

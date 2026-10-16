const mongoose = require('mongoose');

// Links a patient to a doctor (a patient can have many doctors, a doctor many patients)
const mappingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'patient_doctor_mappings' });

// The same doctor can't be assigned to the same patient twice
mappingSchema.index({ patientId: 1, doctorId: 1 }, { unique: true, name: 'unique_patient_doctor' });

module.exports = mongoose.model('Mapping', mappingSchema);

const mongoose = require('mongoose');

// Join collection for the many-to-many link between patients and doctors
const mappingSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  notes: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'patient_doctor_mappings' });

// A doctor can be assigned to the same patient only once
mappingSchema.index({ patientId: 1, doctorId: 1 }, { unique: true, name: 'unique_patient_doctor' });
mappingSchema.index({ doctorId: 1 });

// populate('patient') / populate('doctor') fill these without changing patientId / doctorId
mappingSchema.virtual('patient', { ref: 'Patient', localField: 'patientId', foreignField: '_id', justOne: true });
mappingSchema.virtual('doctor', { ref: 'Doctor', localField: 'doctorId', foreignField: '_id', justOne: true });

module.exports = mongoose.model('Mapping', mappingSchema);

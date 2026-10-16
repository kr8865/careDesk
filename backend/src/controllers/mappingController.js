const { Mapping, Patient, Doctor } = require('../models');
const ApiError = require('../utils/ApiError');

const populate = [
  { path: 'patient', select: 'name age gender' },
  { path: 'doctor', select: 'name specialization email' },
];

// POST /api/mappings/  { patientId, doctorId, notes? }
exports.create = async (req, res) => {
  const { patientId, doctorId, notes } = req.body;

  const patient = await Patient.findOne({ _id: patientId, createdBy: req.user._id });
  if (!patient) throw ApiError.notFound('Patient not found');
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw ApiError.notFound('Doctor not found');

  if (await Mapping.exists({ patientId, doctorId })) throw ApiError.conflict('This doctor is already assigned to this patient');

  const created = await Mapping.create({ patientId, doctorId, notes: notes || null, createdBy: req.user._id });
  const mapping = await Mapping.findById(created._id).populate(populate);
  res.status(201).json({ success: true, message: 'Doctor assigned to patient', mapping });
};

// GET /api/mappings/  - all mappings for the current user's patients
exports.list = async (req, res) => {
  const patientIds = await Patient.find({ createdBy: req.user._id }).distinct('_id');
  const mappings = await Mapping.find({ patientId: { $in: patientIds } }).populate(populate).sort({ createdAt: -1 });
  res.json({ success: true, count: mappings.length, mappings });
};

// GET /api/mappings/:patientId/  - doctors assigned to one patient
exports.doctorsForPatient = async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.patientId, createdBy: req.user._id }).select('name');
  if (!patient) throw ApiError.notFound('Patient not found');
  const mappings = await Mapping.find({ patientId: patient._id }).populate('doctor').sort({ createdAt: 1 });
  const doctors = mappings.map((m) => m.doctor);
  res.json({ success: true, patient: { id: patient.id, name: patient.name }, count: doctors.length, doctors });
};

// DELETE /api/mappings/:id/
exports.remove = async (req, res) => {
  const mapping = await Mapping.findById(req.params.id);
  const owns = mapping && await Patient.exists({ _id: mapping.patientId, createdBy: req.user._id });
  if (!owns) throw ApiError.notFound('Mapping not found');
  await mapping.deleteOne();
  res.json({ success: true, message: 'Doctor removed from patient' });
};

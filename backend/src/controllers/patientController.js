const { Patient, Mapping } = require('../models');
const ApiError = require('../utils/ApiError');

const FIELDS = ['name', 'age', 'gender', 'phone', 'email', 'address', 'medicalHistory'];
const pick = (body) => Object.fromEntries(
  FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f] === '' ? null : body[f]]),
);

// Patients are private: a user only ever sees the ones they created
const findOwned = async (id, userId) => {
  const patient = await Patient.findOne({ _id: id, createdBy: userId });
  if (!patient) throw ApiError.notFound('Patient not found');
  return patient;
};

exports.create = async (req, res) => {
  const patient = await Patient.create({ ...pick(req.body), createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Patient created', patient });
};

exports.list = async (req, res) => {
  const patients = await Patient.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: patients.length, patients });
};

exports.get = async (req, res) => {
  const patient = await findOwned(req.params.id, req.user._id);
  const mappings = await Mapping.find({ patientId: patient._id }).populate('doctor').sort({ createdAt: 1 });
  const doctors = mappings.map((m) => m.doctor);
  res.json({ success: true, patient: { ...patient.toJSON(), doctors } });
};

exports.update = async (req, res) => {
  const patient = await findOwned(req.params.id, req.user._id);
  const data = pick(req.body);
  if (!Object.keys(data).length) throw ApiError.badRequest('No valid fields to update');
  patient.set(data);
  await patient.save();
  res.json({ success: true, message: 'Patient updated', patient });
};

exports.remove = async (req, res) => {
  const patient = await findOwned(req.params.id, req.user._id);
  await Mapping.deleteMany({ patientId: patient._id }); // cascade: remove this patient's assignments
  await patient.deleteOne();
  res.json({ success: true, message: 'Patient deleted' });
};

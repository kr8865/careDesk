const { Patient, Mapping } = require('../models');
const ApiError = require('../utils/ApiError');

// Only the fields a user is allowed to set
const patientData = ({ name, age, gender, phone, email, address, medicalHistory }) =>
  ({ name, age, gender, phone, email, address, medicalHistory });

// Users only see the patients they created
const findOwned = async (id, userId) => {
  const patient = await Patient.findOne({ _id: id, createdBy: userId });
  if (!patient) throw ApiError.notFound('Patient not found');
  return patient;
};

exports.create = async (req, res) => {
  const patient = await Patient.create({ ...patientData(req.body), createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Patient created', patient });
};

exports.list = async (req, res) => {
  const patients = await Patient.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: patients.length, patients });
};

exports.get = async (req, res) => {
  const patient = await findOwned(req.params.id, req.user._id);
  const mappings = await Mapping.find({ patientId: patient._id }).populate('doctorId');
  const doctors = mappings.map((m) => m.doctorId);
  res.json({ success: true, patient: { ...patient.toJSON(), doctors } });
};

exports.update = async (req, res) => {
  const patient = await Patient.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    patientData(req.body), // undefined fields are skipped, so partial updates work
    { new: true },
  );
  if (!patient) throw ApiError.notFound('Patient not found');
  res.json({ success: true, message: 'Patient updated', patient });
};

exports.remove = async (req, res) => {
  const patient = await findOwned(req.params.id, req.user._id);
  await Mapping.deleteMany({ patientId: patient._id }); // also remove this patient's assignments
  await patient.deleteOne();
  res.json({ success: true, message: 'Patient deleted' });
};

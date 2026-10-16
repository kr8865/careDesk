const { Doctor, Mapping } = require('../models');
const ApiError = require('../utils/ApiError');

// Only the fields a user is allowed to set
const doctorData = ({ name, specialization, email, phone, experienceYears }) =>
  ({ name, specialization, email, phone, experienceYears });

// Every user can see all doctors, but only the creator can edit or delete one
const findEditable = async (id, userId) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw ApiError.notFound('Doctor not found');
  if (!doctor.createdBy.equals(userId)) throw ApiError.forbidden('Only the user who added this doctor can change it');
  return doctor;
};

exports.create = async (req, res) => {
  const doctor = await Doctor.create({ ...doctorData(req.body), createdBy: req.user._id });
  res.status(201).json({ success: true, message: 'Doctor created', doctor });
};

exports.list = async (req, res) => {
  const doctors = await Doctor.find().sort({ name: 1 });
  res.json({ success: true, count: doctors.length, doctors });
};

exports.get = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw ApiError.notFound('Doctor not found');
  res.json({ success: true, doctor });
};

exports.update = async (req, res) => {
  const doctor = await findEditable(req.params.id, req.user._id);
  await doctor.updateOne(doctorData(req.body));
  res.json({ success: true, message: 'Doctor updated', doctor: await Doctor.findById(doctor._id) });
};

exports.remove = async (req, res) => {
  const doctor = await findEditable(req.params.id, req.user._id);
  await Mapping.deleteMany({ doctorId: doctor._id }); // also remove this doctor's assignments
  await doctor.deleteOne();
  res.json({ success: true, message: 'Doctor deleted' });
};

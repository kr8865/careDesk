const { Doctor, Mapping } = require('../models');
const ApiError = require('../utils/ApiError');

const FIELDS = ['name', 'specialization', 'email', 'phone', 'experienceYears'];
const pick = (body) => Object.fromEntries(
  FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f] === '' ? null : body[f]]),
);

const DUPLICATE = 'A doctor with this email already exists';

// Doctors are visible to every logged-in user; only the creator may edit or delete one
const findEditable = async (id, userId) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw ApiError.notFound('Doctor not found');
  if (!doctor.createdBy.equals(userId)) throw ApiError.forbidden('Only the user who added this doctor can change it');
  return doctor;
};

exports.create = async (req, res) => {
  const data = pick(req.body);
  if (data.email && await Doctor.exists({ email: String(data.email).toLowerCase() })) throw ApiError.conflict(DUPLICATE);
  const doctor = await Doctor.create({ ...data, createdBy: req.user._id });
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
  const data = pick(req.body);
  if (!Object.keys(data).length) throw ApiError.badRequest('No valid fields to update');
  if (data.email && await Doctor.exists({ email: String(data.email).toLowerCase(), _id: { $ne: doctor._id } })) {
    throw ApiError.conflict(DUPLICATE);
  }
  doctor.set(data);
  await doctor.save();
  res.json({ success: true, message: 'Doctor updated', doctor });
};

exports.remove = async (req, res) => {
  const doctor = await findEditable(req.params.id, req.user._id);
  await Mapping.deleteMany({ doctorId: doctor._id }); // cascade: remove this doctor's assignments
  await doctor.deleteOne();
  res.json({ success: true, message: 'Doctor deleted' });
};

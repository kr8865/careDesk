const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 255,
    match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
  },
  // select: false keeps the hash out of every query unless asked for with .select('+password')
  password: { type: String, required: true, select: false },
}, { timestamps: true });

userSchema.pre('save', async function hashPassword() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.checkPassword = function checkPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);

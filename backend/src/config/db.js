const mongoose = require('mongoose');
const env = require('./env');

// Needed: adds `id` to every JSON response (the frontend uses it) and the populated patient/doctor on mappings
mongoose.set('toJSON', { virtuals: true });

async function connectDB() {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');
}

module.exports = { mongoose, connectDB };

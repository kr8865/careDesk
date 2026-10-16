const env = require('./config/env');
const app = require('./app');
const { connectDB, mongoose } = require('./config/db');
const models = require('./models');

(async () => {
  try {
    await connectDB();
    // Builds the unique indexes (user email, doctor email, patient+doctor pair) before taking requests
    await Promise.all([models.User, models.Patient, models.Doctor, models.Mapping].map((m) => m.init()));
    const server = app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));

    const shutdown = async () => {
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();

const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.MONGODB_URI;

const userConnection = mongoose.createConnection(`${dbUrl}/database`, {
  serverSelectionTimeoutMS: 5000,
});

const dataSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  mobile: String,
  address: String,
  password: String,
  hashPassword: String,
  date: { type: String, default: () => new Date().toLocaleDateString() },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
});

const DatabaseUser = userConnection.model('User', dataSchema);

userConnection.on('connected', () =>
  console.log('Atlas User DB connected successfully'),
);
userConnection.on('error', (err) =>
  console.error('Atlas User DB connection error:', err),
);
userConnection.on('disconnected', () =>
  console.log('Atlas User DB disconnected'),
);

process.on('SIGINT', async () => {
  await userConnection.close();
  console.log('MongoDB connections closed due to application termination');
  process.exit(0);
});

module.exports = { DatabaseUser };

const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB] Local connection failed (${error.message}). Starting in-memory database fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to In-Memory Database: ${uri}`);
      return conn;
    } catch (memError) {
      console.error(`[MongoDB] Failed to start fallback database: ${memError.message}`);
      if (config.nodeEnv !== 'test') {
        process.exit(1);
      }
      throw memError;
    }
  }
};

module.exports = connectDB;


const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.port, () => {
      console.log(`[DevConnect API] Server running in ${config.nodeEnv} mode on port ${config.port}`);
    });

    const shutdown = () => {
      console.log('[DevConnect API] Gracefully shutting down...');
      server.close(() => {
        console.log('[DevConnect API] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(`[DevConnect API] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;

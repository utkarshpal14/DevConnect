const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');
const { initSocketIO } = require('./sockets/socket.server');

const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP server and attach Socket.IO for WebSocket support
    const httpServer = http.createServer(app);
    initSocketIO(httpServer);

    httpServer.listen(config.port, () => {
      console.log(`[DevConnect API] Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`[DevConnect API] Socket.IO realtime server active`);
    });

    const shutdown = () => {
      console.log('[DevConnect API] Gracefully shutting down...');
      httpServer.close(() => {
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

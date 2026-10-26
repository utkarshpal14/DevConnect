/**
 * Socket.IO Realtime Server
 * Milestone 8: Realtime Notifications
 *
 * Manages Socket.IO server initialization, per-user room joining,
 * and all realtime event emission helpers.
 */

let io = null;

// Map of userId -> Set of socketIds (supports multiple tabs)
const userSockets = new Map();

/**
 * Initialize Socket.IO server attached to an HTTP server instance.
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server} io instance
 */
function initSocketIO(httpServer) {
  const { Server } = require('socket.io');

  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Client sends their userId after connecting to join their personal room
    socket.on('join', (userId) => {
      if (!userId) return;

      socket.join(`user:${userId}`);
      console.log(`[Socket.IO] User ${userId} joined room user:${userId}`);

      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);
    });

    socket.on('disconnect', () => {
      // Remove socket from userSockets map
      for (const [userId, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            userSockets.delete(userId);
          }
          break;
        }
      }
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  console.log('[Socket.IO] Realtime server initialized');
  return io;
}

/**
 * Emit a realtime notification event to a specific user's room.
 * @param {string} userId  - Target user's MongoDB ObjectId string
 * @param {object} notification - Notification payload to emit
 */
function emitNotification(userId, notification) {
  if (!io) return;
  io.to(`user:${userId}`).emit('notification', notification);
}

/**
 * Emit a named event to all connected clients (broadcast).
 * @param {string} event - Event name
 * @param {*} data       - Payload
 */
function broadcastEvent(event, data) {
  if (!io) return;
  io.emit(event, data);
}

/**
 * Check whether a specific user has any active socket connections.
 * @param {string} userId
 * @returns {boolean}
 */
function isUserOnline(userId) {
  const sockets = userSockets.get(String(userId));
  return !!(sockets && sockets.size > 0);
}

/**
 * Get the underlying Socket.IO instance (for advanced usage).
 */
function getIO() {
  return io;
}

module.exports = {
  initSocketIO,
  emitNotification,
  broadcastEvent,
  isUserOnline,
  getIO
};

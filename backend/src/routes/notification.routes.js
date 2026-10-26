/**
 * Notification Routes
 * Milestone 8: Realtime Notifications REST Endpoints
 */

const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const authenticate = require('../middlewares/auth.middleware');

// All notification routes require authentication
router.use(authenticate);

// GET /api/v1/notifications — fetch paginated notifications (supports ?unread=true)
router.get('/', NotificationController.getNotifications);

// GET /api/v1/notifications/unread-count — lightweight badge count
router.get('/unread-count', NotificationController.getUnreadCount);

// PATCH /api/v1/notifications/read-all — mark all as read
router.patch('/read-all', NotificationController.markAllAsRead);

// PATCH /api/v1/notifications/:id/read — mark one as read
router.patch('/:id/read', NotificationController.markAsRead);

// DELETE /api/v1/notifications/:id — delete one notification
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;

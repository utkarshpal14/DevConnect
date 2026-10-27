/**
 * Notification Controller
 * Milestone 8: Realtime Notifications REST API
 *
 * GET  /api/v1/notifications          - Fetch authenticated user's notifications
 * GET  /api/v1/notifications/unread-count - Get unread count badge
 * PATCH /api/v1/notifications/:id/read - Mark a notification as read
 * PATCH /api/v1/notifications/read-all - Mark all as read
 * DELETE /api/v1/notifications/:id    - Delete a notification
 */

const Notification = require('../models/Notification');

// ──────────────────────────────────────────────
// GET /api/v1/notifications
// ──────────────────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unread === 'true';

    const filter = { recipientId: userId };
    if (unreadOnly) filter.isRead = false;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter)
    ]);

    const unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// GET /api/v1/notifications/unread-count
// ──────────────────────────────────────────────
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user._id,
      isRead: false
    });
    return res.status(200).json({ success: true, data: { unreadCount: count } });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// PATCH /api/v1/notifications/:id/read
// ──────────────────────────────────────────────
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, data: { notification } });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// PATCH /api/v1/notifications/read-all
// ──────────────────────────────────────────────
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { recipientId: req.user._id, isRead: false },
      { isRead: true }
    );
    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marked as read`
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// DELETE /api/v1/notifications/:id
// ──────────────────────────────────────────────
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipientId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

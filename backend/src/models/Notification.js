const mongoose = require('mongoose');

/**
 * Notification Model
 * Milestone 8: Realtime Notifications
 * Stores in-app notifications for students and recruiters.
 */
const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user ID is required'],
      index: true
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: [
        'application_submitted',
        'candidate_shortlisted',
        'candidate_rejected',
        'candidate_selected',
        'job_created',
        'status_updated',
        'general'
      ],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: 'notifications'
  }
);

// Compound index for efficient unread queries per user
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

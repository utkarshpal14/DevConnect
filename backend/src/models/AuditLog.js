const mongoose = require('mongoose');

/**
 * AuditLog Model
 * Milestone 8: System Audit Logging
 * Records every significant system event for admin audit trail visibility.
 */
const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    actorRole: {
      type: String,
      enum: ['student', 'recruiter', 'admin', 'system'],
      default: 'system'
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      index: true
    },
    resource: {
      type: String,
      required: [true, 'Resource type is required']
    },
    resourceId: {
      type: String,
      default: null
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success'
    }
  },
  {
    timestamps: true,
    collection: 'audit_logs'
  }
);

// TTL index: auto-expire audit logs after 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);

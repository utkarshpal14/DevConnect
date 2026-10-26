/**
 * Notification Event Triggers
 * Milestone 8: Realtime Notifications
 *
 * Creates DB notification records AND emits Socket.IO realtime events
 * for every significant application lifecycle action.
 */

const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { emitNotification } = require('./socket.server');

/**
 * Create a Notification document and emit it to the recipient in real-time.
 * @param {object} params
 * @param {string} params.recipientId
 * @param {string} params.type
 * @param {string} params.title
 * @param {string} params.message
 * @param {object} [params.metadata]
 */
async function createAndEmitNotification({ recipientId, type, title, message, metadata = {} }) {
  try {
    const notification = await Notification.create({
      recipientId,
      type,
      title,
      message,
      metadata
    });

    // Emit realtime event to recipient's Socket.IO room
    emitNotification(String(recipientId), {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: false,
      metadata: notification.metadata,
      createdAt: notification.createdAt
    });

    return notification;
  } catch (err) {
    console.error('[Notifications] Failed to create notification:', err.message);
  }
}

// ==========================================
// Event: Student submits a job application
// ==========================================
/**
 * @param {object} opts
 * @param {string} opts.recruiterId    - Recruiter user ID to notify
 * @param {string} opts.studentName
 * @param {string} opts.jobTitle
 * @param {string} opts.jobId
 * @param {string} opts.applicationId
 */
async function notifyApplicationSubmitted({ recruiterId, studentName, jobTitle, jobId, applicationId }) {
  return createAndEmitNotification({
    recipientId: recruiterId,
    type: 'application_submitted',
    title: 'New Application Received',
    message: `${studentName} applied for "${jobTitle}".`,
    metadata: { jobId, applicationId }
  });
}

// ==========================================
// Event: Recruiter shortlists a candidate
// ==========================================
/**
 * @param {object} opts
 * @param {string} opts.studentId    - Student user ID to notify
 * @param {string} opts.jobTitle
 * @param {string} opts.companyName
 * @param {string} opts.applicationId
 */
async function notifyCandidateShortlisted({ studentId, jobTitle, companyName, applicationId }) {
  return createAndEmitNotification({
    recipientId: studentId,
    type: 'candidate_shortlisted',
    title: '🎉 You\'ve Been Shortlisted!',
    message: `Congratulations! You've been shortlisted for "${jobTitle}" at ${companyName}.`,
    metadata: { applicationId }
  });
}

// ==========================================
// Event: Recruiter rejects a candidate
// ==========================================
async function notifyCandidateRejected({ studentId, jobTitle, companyName, applicationId }) {
  return createAndEmitNotification({
    recipientId: studentId,
    type: 'candidate_rejected',
    title: 'Application Update',
    message: `Your application for "${jobTitle}" at ${companyName} was not selected at this time.`,
    metadata: { applicationId }
  });
}

// ==========================================
// Event: Candidate is Selected
// ==========================================
async function notifyCandidateSelected({ studentId, jobTitle, companyName, applicationId }) {
  return createAndEmitNotification({
    recipientId: studentId,
    type: 'candidate_selected',
    title: '🏆 You\'ve Been Selected!',
    message: `You have been selected for "${jobTitle}" at ${companyName}! Congratulations!`,
    metadata: { applicationId }
  });
}

// ==========================================
// Event: Recruiter creates a new job
// ==========================================
async function notifyJobCreated({ recruiterId, jobTitle, jobId }) {
  return createAndEmitNotification({
    recipientId: recruiterId,
    type: 'job_created',
    title: 'Job Posting Live',
    message: `Your job "${jobTitle}" is now live and accepting applications.`,
    metadata: { jobId }
  });
}

// ==========================================
// Audit Log Helper
// ==========================================
/**
 * Write an audit log entry (fire-and-forget).
 */
async function writeAuditLog({ actorId, actorRole, action, resource, resourceId, details, ipAddress, status = 'success' }) {
  try {
    await AuditLog.create({ actorId, actorRole, action, resource, resourceId, details, ipAddress, status });
  } catch (err) {
    console.error('[AuditLog] Failed to write audit log:', err.message);
  }
}

module.exports = {
  createAndEmitNotification,
  notifyApplicationSubmitted,
  notifyCandidateShortlisted,
  notifyCandidateRejected,
  notifyCandidateSelected,
  notifyJobCreated,
  writeAuditLog
};

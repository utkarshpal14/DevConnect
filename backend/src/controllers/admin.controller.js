/**
 * Admin Controller
 * Milestone 8: Admin Dashboard APIs
 *
 * GET  /api/v1/admin/dashboard   - Platform KPI statistics
 * GET  /api/v1/admin/users       - Paginated user management list
 * PATCH /api/v1/admin/users/:id/toggle - Enable/disable user account
 * GET  /api/v1/admin/audit-logs  - System audit log viewer (paginated)
 */

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// ──────────────────────────────────────────────
// GET /api/v1/admin/dashboard
// ──────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalRecruiters,
      totalAdmins,
      activeUsers,
      disabledUsers,
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      appliedCount,
      shortlistedCount,
      rejectedCount,
      selectedCount,
      totalNotifications,
      unreadNotifications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'Open' }),
      Job.countDocuments({ status: 'Closed' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Applied' }),
      Application.countDocuments({ status: 'Shortlisted' }),
      Application.countDocuments({ status: 'Rejected' }),
      Application.countDocuments({ status: 'Selected' }),
      Notification.countDocuments(),
      Notification.countDocuments({ isRead: false })
    ]);

    // Recent activity: last 5 audit logs
    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('actorId', 'fullName email role')
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          recruiters: totalRecruiters,
          admins: totalAdmins,
          active: activeUsers,
          disabled: disabledUsers
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          closed: closedJobs
        },
        applications: {
          total: totalApplications,
          applied: appliedCount,
          shortlisted: shortlistedCount,
          rejected: rejectedCount,
          selected: selectedCount
        },
        notifications: {
          total: totalNotifications,
          unread: unreadNotifications
        },
        recentActivity
      }
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// GET /api/v1/admin/users
// ──────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const isActive = req.query.isActive;
    const search = req.query.search;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
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
// PATCH /api/v1/admin/users/:id/toggle
// ──────────────────────────────────────────────
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Admin cannot disable themselves
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot disable your own admin account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Write audit log
    const { writeAuditLog } = require('../sockets/notification.events');
    await writeAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: user.isActive ? 'user_enabled' : 'user_disabled',
      resource: 'User',
      resourceId: String(user._id),
      details: { email: user.email, newStatus: user.isActive },
      ipAddress: req.ip
    });

    return res.status(200).json({
      success: true,
      message: `User account ${user.isActive ? 'enabled' : 'disabled'} successfully`,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

// ──────────────────────────────────────────────
// GET /api/v1/admin/audit-logs
// ──────────────────────────────────────────────
const getAuditLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const action = req.query.action;
    const status = req.query.status;

    const filter = {};
    if (action) filter.action = { $regex: action, $options: 'i' };
    if (status) filter.status = status;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('actorId', 'fullName email role')
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        logs,
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

module.exports = {
  getDashboard,
  getUsers,
  toggleUserStatus,
  getAuditLogs
};

/**
 * Admin Routes
 * Milestone 8: Admin Dashboard REST Endpoints
 */

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorizeRoles('admin'));

// GET /api/v1/admin/dashboard — platform KPI statistics
router.get('/dashboard', AdminController.getDashboard);

// GET /api/v1/admin/users — paginated user management list
router.get('/users', AdminController.getUsers);

// PATCH /api/v1/admin/users/:id/toggle — enable/disable user account
router.patch('/users/:id/toggle', AdminController.toggleUserStatus);

// GET /api/v1/admin/audit-logs — system audit log viewer
router.get('/audit-logs', AdminController.getAuditLogs);

module.exports = router;

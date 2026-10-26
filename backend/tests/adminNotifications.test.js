const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Notification = require('../src/models/Notification');
const AuditLog = require('../src/models/AuditLog');
const jwt = require('jsonwebtoken');
const config = require('../src/config/env');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: '1d' }
  );
};

let mongoServer;

describe('Milestone 8: Admin & Notification Endpoints', () => {
  let adminToken;
  let studentToken;
  let recruiterToken;
  let adminUser;
  let studentUser;
  let recruiterUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    adminUser = await User.create({
      fullName: 'Admin Test User',
      email: 'admin_m8@test.com',
      passwordHash: 'dummyhash123',
      role: 'admin',
      isActive: true
    });

    studentUser = await User.create({
      fullName: 'Student Test User',
      email: 'student_m8@test.com',
      passwordHash: 'dummyhash123',
      role: 'student',
      isActive: true
    });

    recruiterUser = await User.create({
      fullName: 'Recruiter Test User',
      email: 'recruiter_m8@test.com',
      passwordHash: 'dummyhash123',
      role: 'recruiter',
      isActive: true
    });

    adminToken = generateToken(adminUser);
    studentToken = generateToken(studentUser);
    recruiterToken = generateToken(recruiterUser);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('Admin Dashboard & Management APIs', () => {
    test('GET /api/v1/admin/dashboard should return platform KPIs for admin', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('jobs');
      expect(res.body.data).toHaveProperty('applications');
      expect(res.body.data).toHaveProperty('notifications');
      expect(res.body.data).toHaveProperty('recentActivity');
    });

    test('GET /api/v1/admin/dashboard should reject non-admin users with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
    });

    test('GET /api/v1/admin/users should return paginated users list', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.users)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
    });

    test('PATCH /api/v1/admin/users/:id/toggle should toggle user active status and log audit event', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${studentUser._id}/toggle`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.isActive).toBe(false);

      // Verify audit log entry was created
      const log = await AuditLog.findOne({ resourceId: String(studentUser._id) });
      expect(log).not.toBeNull();
      expect(log.action).toBe('user_disabled');

      // Toggle back to active
      const restoreRes = await request(app)
        .patch(`/api/v1/admin/users/${studentUser._id}/toggle`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(restoreRes.statusCode).toBe(200);
      expect(restoreRes.body.data.user.isActive).toBe(true);
    });

    test('PATCH /api/v1/admin/users/:id/toggle should prevent admin from disabling own account', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${adminUser._id}/toggle`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('GET /api/v1/admin/audit-logs should return audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.logs)).toBe(true);
    });
  });

  describe('Notification APIs', () => {
    let testNotif;

    beforeEach(async () => {
      testNotif = await Notification.create({
        recipientId: studentUser._id,
        type: 'application_submitted',
        title: 'Application Received',
        message: 'Your application for Frontend Engineer has been submitted.',
        isRead: false
      });
    });

    afterEach(async () => {
      await Notification.deleteMany({});
    });

    test('GET /api/v1/notifications should return list of notifications', async () => {
      const res = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notifications.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.unreadCount).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/v1/notifications/unread-count should return unread badge count', async () => {
      const res = await request(app)
        .get('/api/v1/notifications/unread-count')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.unreadCount).toBe(1);
    });

    test('PATCH /api/v1/notifications/:id/read should mark notification as read', async () => {
      const res = await request(app)
        .patch(`/api/v1/notifications/${testNotif._id}/read`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notification.isRead).toBe(true);
    });

    test('PATCH /api/v1/notifications/read-all should mark all notifications as read', async () => {
      const res = await request(app)
        .patch('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const count = await Notification.countDocuments({ recipientId: studentUser._id, isRead: false });
      expect(count).toBe(0);
    });

    test('DELETE /api/v1/notifications/:id should remove the notification', async () => {
      const res = await request(app)
        .delete(`/api/v1/notifications/${testNotif._id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Notification.findById(testNotif._id);
      expect(found).toBeNull();
    });
  });
});

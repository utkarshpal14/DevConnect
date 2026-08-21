const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const app = require('../src/app');
const User = require('../src/models/User');
const authenticate = require('../src/middlewares/auth.middleware');
const authorizeRoles = require('../src/middlewares/role.middleware');

let mongoServer;

// Setup in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Clean up database between test cases
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close database and stop memory server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('DevConnect API - Health & Base Endpoints', () => {
  it('GET /api/v1/health should return 200 and health status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('healthy');
  });

  it('GET /api/v1/unknown should return 404', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('AT-01: User Registration (/api/v1/auth/register)', () => {
  const validStudent = {
    fullName: 'Kapish Garg',
    email: 'kapish@example.com',
    password: 'Password123',
    role: 'student'
  };

  it('should register a new student user with 201 Created', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validStudent);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.data).toHaveProperty('userId');

    // Verify record in database
    const savedUser = await User.findById(res.body.data.userId);
    expect(savedUser).not.toBeNull();
    expect(savedUser.email).toBe(validStudent.email.toLowerCase());
    expect(savedUser.role).toBe('student');
    expect(savedUser.isActive).toBe(true);
    expect(savedUser.passwordHash).not.toBe(validStudent.password);
  });

  it('should register a recruiter and admin successfully', async () => {
    const recruiterRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Jane Recruiter',
        email: 'recruiter@company.com',
        password: 'Password123',
        role: 'recruiter'
      });
    expect(recruiterRes.statusCode).toBe(201);

    const adminRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Admin User',
        email: 'admin@devconnect.com',
        password: 'Password123',
        role: 'admin'
      });
    expect(adminRes.statusCode).toBe(201);
  });

  it('should return 409 Conflict if email is already registered', async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send(validStudent);

    const duplicateRes = await request(app)
      .post('/api/v1/auth/register')
      .send(validStudent);

    expect(duplicateRes.statusCode).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toContain('already exists');
  });

  it('should return 400 Bad Request if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'missing_name@example.com',
        password: 'Password123',
        role: 'student'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Full name is required');
  });

  it('should return 400 Bad Request if email format is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test User',
        email: 'invalid-email-address',
        password: 'Password123',
        role: 'student'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Please provide a valid email address');
  });

  it('should return 400 Bad Request if password length is under 6 characters', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test User',
        email: 'shortpass@example.com',
        password: '123',
        role: 'student'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Password must be at least 6 characters long');
  });

  it('should return 400 Bad Request if role is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test User',
        email: 'badrole@example.com',
        password: 'Password123',
        role: 'superman'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Role must be one of');
  });
});

describe('AT-02 & AT-03: User Login (/api/v1/auth/login)', () => {
  const userCredentials = {
    fullName: 'Login Tester',
    email: 'tester@example.com',
    password: 'SecretPassword123',
    role: 'student'
  };

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send(userCredentials);
  });

  it('AT-02: should login successfully and return JWT token with user profile', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user.email).toBe(userCredentials.email);
    expect(res.body.data.user.role).toBe('student');
    expect(res.body.data.user).not.toHaveProperty('passwordHash');
  });

  it('AT-03: should return 401 Unauthorized on incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userCredentials.email,
        password: 'WrongPassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('AT-03: should return 401 Unauthorized on non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nobody@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should return 403 Forbidden if user account is deactivated (isActive = false)', async () => {
    await User.findOneAndUpdate({ email: userCredentials.email }, { isActive: false });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User account is disabled');
  });
});

describe('AT-04: Current User Profile (/api/v1/auth/me)', () => {
  let authToken;
  const userCredentials = {
    fullName: 'Kapish Profile',
    email: 'profile@example.com',
    password: 'Password123',
    role: 'student'
  };

  beforeEach(async () => {
    await request(app)
      .post('/api/v1/auth/register')
      .send(userCredentials);

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userCredentials.email,
        password: userCredentials.password
      });

    authToken = loginRes.body.data.token;
  });

  it('should return current user data when authenticated with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(userCredentials.email);
    expect(res.body.data.user.fullName).toBe(userCredentials.fullName);
    expect(res.body.data.user.role).toBe(userCredentials.role);
    expect(res.body.data.user).not.toHaveProperty('passwordHash');
  });

  it('should return 401 Unauthorized if Authorization header is missing', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('token missing');
  });

  it('should return 401 Unauthorized if Bearer token is invalid/tampered', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid.token.payload');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid authentication token');
  });
});

describe('AT-05: Role-Based Access Control (RBAC)', () => {
  let studentToken;
  let adminToken;
  let testApp;

  beforeAll(() => {
    // Create temporary test routes to verify RBAC middleware
    testApp = express();
    testApp.use(express.json());
    testApp.use('/api/v1/auth', require('../src/routes/auth.routes'));

    testApp.get('/api/v1/test/admin-only', authenticate, authorizeRoles('admin'), (req, res) => {
      res.status(200).json({ success: true, message: 'Welcome Admin' });
    });

    testApp.get('/api/v1/test/recruiter-or-admin', authenticate, authorizeRoles('recruiter', 'admin'), (req, res) => {
      res.status(200).json({ success: true, message: 'Welcome Recruiter or Admin' });
    });
  });

  beforeEach(async () => {
    // Register & login student
    await request(testApp).post('/api/v1/auth/register').send({
      fullName: 'Student One',
      email: 'student1@example.com',
      password: 'Password123',
      role: 'student'
    });
    const sLogin = await request(testApp).post('/api/v1/auth/login').send({
      email: 'student1@example.com',
      password: 'Password123'
    });
    studentToken = sLogin.body.data.token;

    // Register & login admin
    await request(testApp).post('/api/v1/auth/register').send({
      fullName: 'Admin One',
      email: 'admin1@example.com',
      password: 'Password123',
      role: 'admin'
    });
    const aLogin = await request(testApp).post('/api/v1/auth/login').send({
      email: 'admin1@example.com',
      password: 'Password123'
    });
    adminToken = aLogin.body.data.token;
  });

  it('should allow admin to access admin-only route', async () => {
    const res = await request(testApp)
      .get('/api/v1/test/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Welcome Admin');
  });

  it('should reject student from accessing admin-only route with 403 Forbidden', async () => {
    const res = await request(testApp)
      .get('/api/v1/test/admin-only')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Forbidden');
  });

  it('should reject student from accessing recruiter-or-admin route with 403 Forbidden', async () => {
    const res = await request(testApp)
      .get('/api/v1/test/recruiter-or-admin')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

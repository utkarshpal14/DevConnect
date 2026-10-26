const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const StudentProfile = require('../src/models/StudentProfile');

let mongoServer;
let studentToken;
let recruiterToken;
let studentUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  // Register & login student user
  const sRegister = await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Alex Student',
      email: 'alex.student@example.com',
      password: 'Password123',
      role: 'student'
    });
  studentUserId = sRegister.body.data.userId;

  const sLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'alex.student@example.com',
      password: 'Password123'
    });
  studentToken = sLogin.body.data.token;

  // Register & login recruiter user (for RBAC tests)
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Sarah Recruiter',
      email: 'sarah.recruiter@example.com',
      password: 'Password123',
      role: 'recruiter'
    });

  const rLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'sarah.recruiter@example.com',
      password: 'Password123'
    });
  recruiterToken = rLogin.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence', () => {
  describe('GET /api/v1/ai/skill-gap/roles', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/v1/ai/skill-gap/roles');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject recruiter access with 403 (RBAC)', async () => {
      const res = await request(app)
        .get('/api/v1/ai/skill-gap/roles')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return list of all 5 supported role taxonomies for authenticated students', async () => {
      const res = await request(app)
        .get('/api/v1/ai/skill-gap/roles')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(5);

      const roleTitles = res.body.data.map((r) => r.title);
      expect(roleTitles).toContain('Backend Developer');
      expect(roleTitles).toContain('Frontend Developer');
      expect(roleTitles).toContain('Full Stack Engineer');
      expect(roleTitles).toContain('Data Scientist');
      expect(roleTitles).toContain('DevOps Engineer');
    });
  });

  describe('POST /api/v1/ai/skill-gap', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .send({ targetRole: 'Backend Developer' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject recruiter users with 403 (RBAC)', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ targetRole: 'Backend Developer' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when targetRole is missing', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/target role is required/i);
    });

    it('should return 400 when targetRole is invalid or unsupported', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Cybersecurity Wizard' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid target role/i);
    });

    it('should analyze skill gap when student has no profile created yet (0% readiness)', async () => {
      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Backend Developer' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.targetRole).toBe('Backend Developer');
      expect(res.body.data.readinessScore).toBe(0);
      expect(res.body.data.status).toBe('Early Foundation');
      expect(res.body.data.matchedSkills).toEqual([]);
      expect(res.body.data.missingSkills.length).toBe(8);
      expect(res.body.data.recommendations.length).toBeGreaterThan(0);
    });

    it('should correctly calculate partial skill overlap and readiness percentage', async () => {
      // Create student profile with 4 out of 8 required Backend skills
      await StudentProfile.create({
        userId: studentUserId,
        headline: 'Aspiring Backend Developer',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs']
      });

      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Backend Developer' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.targetRole).toBe('Backend Developer');
      expect(res.body.data.readinessScore).toBe(50); // 4 / 8 = 50%
      expect(res.body.data.status).toBe('Progressing Well');
      expect(res.body.data.matchedCount).toBe(4);
      expect(res.body.data.missingCount).toBe(4);
      expect(res.body.data.matchedSkills).toEqual(
        expect.arrayContaining(['Node.js', 'Express', 'MongoDB', 'REST APIs'])
      );
      expect(res.body.data.missingSkills).toEqual(
        expect.arrayContaining(['SQL', 'Git', 'Docker', 'Redis'])
      );
      expect(res.body.data.recommendations.length).toBe(4);
    });

    it('should normalize skill aliases and casing robustly (e.g. nodejs, mongo, docker)', async () => {
      // Student entered skills with informal casing & aliases
      await StudentProfile.create({
        userId: studentUserId,
        headline: 'Student Engineer',
        skills: ['nodejs', 'expressjs', 'mongodb', 'rest api', 'docker', 'redis', 'git', 'postgres']
      });

      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'backend developer' }); // case-insensitive role request

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.readinessScore).toBe(100);
      expect(res.body.data.status).toBe('Job Ready');
      expect(res.body.data.missingSkills).toEqual([]);
      expect(res.body.data.matchedCount).toBe(8);
      expect(res.body.data.recommendations[0]).toMatch(/100%/);
    });

    it('should analyze skill gap across different target roles (e.g. Frontend Developer)', async () => {
      await StudentProfile.create({
        userId: studentUserId,
        headline: 'Frontend Enthusiast',
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3']
      });

      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'Frontend Developer' });

      expect(res.status).toBe(200);
      expect(res.body.data.targetRole).toBe('Frontend Developer');
      expect(res.body.data.readinessScore).toBe(50);
      expect(res.body.data.matchedSkills).toEqual(
        expect.arrayContaining(['React', 'JavaScript', 'HTML5', 'CSS3'])
      );
      expect(res.body.data.missingSkills).toEqual(
        expect.arrayContaining(['TypeScript', 'Tailwind CSS', 'Git', 'Responsive Design'])
      );
    });

    it('should analyze skill gap for DevOps Engineer track', async () => {
      await StudentProfile.create({
        userId: studentUserId,
        headline: 'Cloud Aspirant',
        skills: ['Linux', 'Docker', 'Git']
      });

      const res = await request(app)
        .post('/api/v1/ai/skill-gap')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ targetRole: 'DevOps Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.data.targetRole).toBe('DevOps Engineer');
      expect(res.body.data.matchedCount).toBe(3);
      expect(res.body.data.missingCount).toBe(5);
      expect(res.body.data.readinessScore).toBe(38); // 3 / 8 = 37.5 -> 38%
    });
  });
});

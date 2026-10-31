const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

let mongoServer;
let studentToken;
let recruiterToken;
const testPdfPath = path.join(__dirname, 'test_sample_resume.pdf');
const testTxtPath = path.join(__dirname, 'test_sample_resume.txt');

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create temporary test files
  // Minimal valid PDF structure
  const minimalPdf = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n';
  fs.writeFileSync(testPdfPath, minimalPdf);
  fs.writeFileSync(testTxtPath, 'This is a plain text file, not a PDF.');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  if (fs.existsSync(testPdfPath)) fs.unlinkSync(testPdfPath);
  if (fs.existsSync(testTxtPath)) fs.unlinkSync(testTxtPath);
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  // Register & login student user
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Student Tester',
      email: 'student.parser@example.com',
      password: 'Password123',
      role: 'student'
    });

  const sLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'student.parser@example.com',
      password: 'Password123'
    });
  studentToken = sLogin.body.data.token;

  // Register & login recruiter user
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Recruiter Tester',
      email: 'recruiter.parser@example.com',
      password: 'Password123',
      role: 'recruiter'
    });

  const rLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'recruiter.parser@example.com',
      password: 'Password123'
    });
  recruiterToken = rLogin.body.data.token;
});

describe('AI Resume Parser API (POST /api/v1/ai/parse-resume)', () => {
  it('should reject unauthenticated requests with 401', async () => {
    const res = await request(app)
      .post('/api/v1/ai/parse-resume');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject unauthorized roles (recruiter) with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/ai/parse-resume')
      .set('Authorization', `Bearer ${recruiterToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Forbidden');
  });

  it('should return 400 when no resume file is attached in request', async () => {
    const res = await request(app)
      .post('/api/v1/ai/parse-resume')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when uploaded file is not a PDF', async () => {
    const res = await request(app)
      .post('/api/v1/ai/parse-resume')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('resume', testTxtPath);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Only PDF');
  });

  it('should successfully accept valid PDF resume and return structured fields', async () => {
    const res = await request(app)
      .post('/api/v1/ai/parse-resume')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('resume', testPdfPath);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data.skills)).toBe(true);
    expect(Array.isArray(res.body.data.projects)).toBe(true);
    expect(Array.isArray(res.body.data.certifications)).toBe(true);
  });
});

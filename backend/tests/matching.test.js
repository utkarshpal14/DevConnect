const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const StudentProfile = require('../src/models/StudentProfile');
const RecruiterProfile = require('../src/models/RecruiterProfile');
const Job = require('../src/models/Job');
const AIMatchResult = require('../src/models/AIMatchResult');
const CandidateMatchingService = require('../src/services/candidateMatching.service');

let mongoServer;
let studentToken;
let recruiterToken;
let otherRecruiterToken;
let studentProfileId;
let jobId;
let otherJobId;

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

  // 1. Create Student User & Profile
  const sReg = await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'John Student',
      email: 'john.student@example.com',
      password: 'Password123',
      role: 'student'
    });

  const sLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'john.student@example.com',
      password: 'Password123'
    });
  studentToken = sLogin.body.data.token;

  // Create student profile with skills
  const studentProfile = await StudentProfile.create({
    userId: sReg.body.data.userId,
    headline: 'Full Stack Enthusiast',
    bio: 'Passionate MERN developer',
    skills: ['Node.js', 'React', 'MongoDB', 'Git']
  });
  studentProfileId = studentProfile._id.toString();

  // 2. Create Primary Recruiter User & Profile
  const rReg = await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Emma Recruiter',
      email: 'emma.recruiter@example.com',
      password: 'Password123',
      role: 'recruiter'
    });

  const rLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'emma.recruiter@example.com',
      password: 'Password123'
    });
  recruiterToken = rLogin.body.data.token;

  const recruiterProfile = await RecruiterProfile.create({
    userId: rReg.body.data.userId,
    companyName: 'TechCorp Solutions',
    companyWebsite: 'https://techcorp.example.com',
    companyDescription: 'Leading tech enterprise',
    location: 'San Francisco, CA'
  });

  // Create Job owned by primary recruiter
  const job = await Job.create({
    recruiterId: recruiterProfile._id,
    title: 'Senior Backend Engineer',
    description: 'Looking for experienced backend developer to scale microservices.',
    employmentType: 'Full-Time',
    location: 'Remote',
    requiredSkills: ['Node.js', 'MongoDB', 'Docker', 'Redis']
  });
  jobId = job._id.toString();

  // 3. Create Second Recruiter (for cross-recruiter authorization tests)
  const r2Reg = await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'David Recruiter',
      email: 'david.recruiter@example.com',
      password: 'Password123',
      role: 'recruiter'
    });

  const r2Login = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'david.recruiter@example.com',
      password: 'Password123'
    });
  otherRecruiterToken = r2Login.body.data.token;

  const otherRecruiterProfile = await RecruiterProfile.create({
    userId: r2Reg.body.data.userId,
    companyName: 'InnoTech Labs',
    companyWebsite: 'https://innotech.example.com',
    companyDescription: 'Innovations in AI',
    location: 'New York, NY'
  });

  const otherJob = await Job.create({
    recruiterId: otherRecruiterProfile._id,
    title: 'Frontend Developer',
    description: 'React developer position.',
    employmentType: 'Full-Time',
    location: 'Remote',
    requiredSkills: ['React', 'CSS3']
  });
  otherJobId = otherJob._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Milestone 6: AI Candidate Match Scoring Engine & Recruiter Review', () => {
  describe('Unit Testing: CandidateMatchingService.calculateScore', () => {
    it('should calculate 100% match when all required skills are present', () => {
      const candidateSkills = ['Node.js', 'MongoDB', 'Docker', 'Redis'];
      const requiredSkills = ['Node.js', 'MongoDB', 'Docker', 'Redis'];

      const result = CandidateMatchingService.calculateScore(candidateSkills, requiredSkills);

      expect(result.matchScore).toBe(100);
      expect(result.matchedSkills).toHaveLength(4);
      expect(result.missingSkills).toHaveLength(0);
    });

    it('should calculate partial match score accurately (50%)', () => {
      const candidateSkills = ['Node.js', 'MongoDB'];
      const requiredSkills = ['Node.js', 'MongoDB', 'Docker', 'Redis'];

      const result = CandidateMatchingService.calculateScore(candidateSkills, requiredSkills);

      expect(result.matchScore).toBe(50);
      expect(result.matchedSkills).toEqual(expect.arrayContaining(['Node.js', 'MongoDB']));
      expect(result.missingSkills).toEqual(expect.arrayContaining(['Docker', 'Redis']));
    });

    it('should calculate 0% match when candidate has none of the required skills', () => {
      const candidateSkills = ['Python', 'Django'];
      const requiredSkills = ['React', 'TypeScript'];

      const result = CandidateMatchingService.calculateScore(candidateSkills, requiredSkills);

      expect(result.matchScore).toBe(0);
      expect(result.matchedSkills).toHaveLength(0);
      expect(result.missingSkills).toHaveLength(2);
    });

    it('should support skill alias and case-insensitive normalization (e.g. nodejs == Node.js)', () => {
      const candidateSkills = ['nodejs', 'reactjs', 'mongo'];
      const requiredSkills = ['Node.js', 'React', 'MongoDB'];

      const result = CandidateMatchingService.calculateScore(candidateSkills, requiredSkills);

      expect(result.matchScore).toBe(100);
      expect(result.matchedSkills).toHaveLength(3);
      expect(result.missingSkills).toHaveLength(0);
    });
  });

  describe('Integration Testing: POST /api/v1/ai/match-candidate', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/v1/ai/match-candidate')
        .send({ studentId: studentProfileId, jobId });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject student access with 403 (Recruiter RBAC)', async () => {
      const res = await request(app)
        .post('/api/v1/ai/match-candidate')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ studentId: studentProfileId, jobId });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing studentId or jobId with 400', async () => {
      const res = await request(app)
        .post('/api/v1/ai/match-candidate')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ studentId: studentProfileId });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 if job does not exist', async () => {
      const nonExistentJobId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .post('/api/v1/ai/match-candidate')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ studentId: studentProfileId, jobId: nonExistentJobId });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 if recruiter attempts to evaluate candidate for a job they do not own', async () => {
      const res = await request(app)
        .post('/api/v1/ai/match-candidate')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ studentId: studentProfileId, jobId: otherJobId });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should successfully evaluate candidate, calculate 50% match score, and persist in ai_match_results', async () => {
      const res = await request(app)
        .post('/api/v1/ai/match-candidate')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ studentId: studentProfileId, jobId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.matchScore).toBe(50);
      expect(res.body.data.matchedSkills).toEqual(expect.arrayContaining(['Node.js', 'MongoDB']));
      expect(res.body.data.missingSkills).toEqual(expect.arrayContaining(['Docker', 'Redis']));

      // Verify record is persisted in MongoDB
      const savedResult = await AIMatchResult.findOne({
        studentId: studentProfileId,
        jobId
      });
      expect(savedResult).not.toBeNull();
      expect(savedResult.matchScore).toBe(50);
      expect(savedResult.matchedSkills).toHaveLength(2);
      expect(savedResult.missingSkills).toHaveLength(2);
    });
  });

  describe('Integration Testing: GET /api/v1/ai/match-candidate/job/:jobId', () => {
    it('should return all persisted match results for a job', async () => {
      // First evaluate the candidate
      await request(app)
        .post('/api/v1/ai/match-candidate')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({ studentId: studentProfileId, jobId });

      // Fetch batch match results
      const res = await request(app)
        .get(`/api/v1/ai/match-candidate/job/${jobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].matchScore).toBe(50);
    });

    it('should reject unauthorized recruiter from fetching match results of another recruiter job', async () => {
      const res = await request(app)
        .get(`/api/v1/ai/match-candidate/job/${otherJobId}`)
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});

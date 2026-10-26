const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
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

  // Create & authenticate a student user
  const studentRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Kapish Student',
      email: 'student@example.com',
      password: 'Password123',
      role: 'student'
    });
  studentUserId = studentRes.body.data.userId;

  const sLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'student@example.com',
      password: 'Password123'
    });
  studentToken = sLogin.body.data.token;

  // Create & authenticate a recruiter user (for RBAC tests)
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Recruiter User',
      email: 'recruiter@example.com',
      password: 'Password123',
      role: 'recruiter'
    });
  const rLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'recruiter@example.com',
      password: 'Password123'
    });
  recruiterToken = rLogin.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }

  // Clean up any test upload files
  const testUploadDir = path.resolve(__dirname, '../uploads/resumes');
  if (fs.existsSync(testUploadDir)) {
    const files = fs.readdirSync(testUploadDir);
    for (const file of files) {
      if (file.startsWith('resume-')) {
        try {
          fs.unlinkSync(path.join(testUploadDir, file));
        } catch (e) {
          // ignore
        }
      }
    }
  }
});

describe('Milestone 2 - Student Profile System', () => {
  describe('SP-01 & SP-02: Profile Creation & Retrieval', () => {
    const profilePayload = {
      headline: 'Full Stack Engineer | Node.js & React',
      bio: 'Enthusiastic developer passionate about distributed systems.',
      githubUrl: 'https://github.com/kapish',
      linkedinUrl: 'https://linkedin.com/in/kapish',
      portfolioUrl: 'https://kapish.dev',
      education: {
        institution: 'Indian Institute of Technology',
        degree: 'Bachelor of Technology',
        branch: 'Computer Science',
        cgpa: 9.2,
        graduationYear: 2026
      }
    };

    it('POST /api/v1/students/profile should create a new profile with 201', async () => {
      const res = await request(app)
        .post('/api/v1/students/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(profilePayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.headline).toBe(profilePayload.headline);
      expect(res.body.data.education.institution).toBe(profilePayload.education.institution);
      expect(res.body.data.education.cgpa).toBe(9.2);
    });

    it('GET /api/v1/students/profile should return current student profile with populated user info', async () => {
      await request(app)
        .post('/api/v1/students/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(profilePayload);

      const res = await request(app)
        .get('/api/v1/students/profile')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.headline).toBe(profilePayload.headline);
      expect(res.body.data.userId).toBeDefined();
      expect(res.body.data.userId.email).toBe('student@example.com');
      expect(res.body.data.userId.fullName).toBe('Kapish Student');
    });

    it('PUT /api/v1/students/profile should update profile fields with 200', async () => {
      await request(app)
        .post('/api/v1/students/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(profilePayload);

      const updateRes = await request(app)
        .put('/api/v1/students/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          headline: 'Senior Backend Architect',
          bio: 'Updated bio information'
        });

      expect(updateRes.statusCode).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.headline).toBe('Senior Backend Architect');
      expect(updateRes.body.data.bio).toBe('Updated bio information');
    });

    it('should validate URLs and CGPA limits on profile creation', async () => {
      const invalidRes = await request(app)
        .post('/api/v1/students/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          githubUrl: 'not-a-valid-url',
          education: {
            cgpa: 15
          }
        });

      expect(invalidRes.statusCode).toBe(400);
      expect(invalidRes.body.success).toBe(false);
    });
  });

  describe('SP-03: Resume Upload (/api/v1/students/resume)', () => {
    it('should upload a valid PDF resume and update student profile', async () => {
      const dummyPdfBuffer = Buffer.from('%PDF-1.4 sample pdf content for testing');

      const res = await request(app)
        .post('/api/v1/students/resume')
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('resume', dummyPdfBuffer, 'my_resume.pdf');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Resume uploaded successfully');
      expect(res.body.data.resumeUrl).toMatch(/^\/uploads\/resumes\/resume-.+\.pdf$/);

      // Verify resumeUrl stored in database profile
      const profile = await StudentProfile.findOne({ userId: studentUserId });
      expect(profile.resumeUrl).toBe(res.body.data.resumeUrl);
    });

    it('should reject non-PDF file uploads with 400 Bad Request', async () => {
      const dummyTxtBuffer = Buffer.from('This is a text file, not a PDF');

      const res = await request(app)
        .post('/api/v1/students/resume')
        .set('Authorization', `Bearer ${studentToken}`)
        .attach('resume', dummyTxtBuffer, 'notes.txt');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Only PDF resumes are accepted');
    });

    it('should return 400 if no file is attached', async () => {
      const res = await request(app)
        .post('/api/v1/students/resume')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Resume file is required');
    });
  });

  describe('Skills Management (/api/v1/students/skills)', () => {
    it('should add a skill and prevent duplicate skills in array', async () => {
      const add1 = await request(app)
        .post('/api/v1/students/skills')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ skill: 'React' });

      expect(add1.statusCode).toBe(200);
      expect(add1.body.data.skills).toContain('React');

      await request(app)
        .post('/api/v1/students/skills')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ skill: 'Node.js' });

      // Add duplicate React
      const addDuplicate = await request(app)
        .post('/api/v1/students/skills')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ skill: 'React' });

      expect(addDuplicate.statusCode).toBe(200);
      const reactOccurrences = addDuplicate.body.data.skills.filter((s) => s === 'React').length;
      expect(reactOccurrences).toBe(1);
      expect(addDuplicate.body.data.skills).toEqual(expect.arrayContaining(['React', 'Node.js']));
    });

    it('should remove a skill from student profile', async () => {
      await request(app)
        .post('/api/v1/students/skills')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ skill: 'Docker' });

      const delRes = await request(app)
        .delete('/api/v1/students/skills/Docker')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(delRes.statusCode).toBe(200);
      expect(delRes.body.data.skills).not.toContain('Docker');
    });

    it('should reject empty skill name with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/students/skills')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ skill: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Projects Management (/api/v1/students/projects)', () => {
    const projectData = {
      title: 'DevConnect Platform',
      description: 'Campus recruitment and developer portfolio platform.',
      techStack: ['Node.js', 'Express', 'React', 'MongoDB'],
      githubUrl: 'https://github.com/example/devconnect',
      liveUrl: 'https://devconnect.example.com'
    };

    it('should add, update, and delete a project subdocument', async () => {
      // 1. Add project
      const addRes = await request(app)
        .post('/api/v1/students/projects')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(projectData);

      expect(addRes.statusCode).toBe(201);
      expect(addRes.body.data.projects.length).toBe(1);
      const projectId = addRes.body.data.projects[0]._id;
      expect(addRes.body.data.projects[0].title).toBe(projectData.title);

      // 2. Update project
      const updateRes = await request(app)
        .put(`/api/v1/students/projects/${projectId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'DevConnect v2.0',
          description: 'Updated description'
        });

      expect(updateRes.statusCode).toBe(200);
      const updatedProject = updateRes.body.data.projects.find((p) => p._id.toString() === projectId);
      expect(updatedProject.title).toBe('DevConnect v2.0');

      // 3. Delete project
      const deleteRes = await request(app)
        .delete(`/api/v1/students/projects/${projectId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(deleteRes.statusCode).toBe(200);
      expect(deleteRes.body.data.projects.length).toBe(0);
    });

    it('should validate required project title and description', async () => {
      const res = await request(app)
        .post('/api/v1/students/projects')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          techStack: ['JavaScript']
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Certifications & Achievements Management', () => {
    it('should add and delete a certification subdocument', async () => {
      const addCert = await request(app)
        .post('/api/v1/students/certifications')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2025-06-01',
          certificateUrl: 'https://aws.amazon.com/verify/123'
        });

      expect(addCert.statusCode).toBe(201);
      expect(addCert.body.data.certifications.length).toBe(1);
      const certId = addCert.body.data.certifications[0]._id;

      const delCert = await request(app)
        .delete(`/api/v1/students/certifications/${certId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(delCert.statusCode).toBe(200);
      expect(delCert.body.data.certifications.length).toBe(0);
    });

    it('should add and delete an achievement subdocument', async () => {
      const addAch = await request(app)
        .post('/api/v1/students/achievements')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Hackathon 1st Prize Winner',
          description: 'Won 1st place in National Smart India Hackathon',
          achievementDate: '2025-09-15'
        });

      expect(addAch.statusCode).toBe(201);
      expect(addAch.body.data.achievements.length).toBe(1);
      const achId = addAch.body.data.achievements[0]._id;

      const delAch = await request(app)
        .delete(`/api/v1/students/achievements/${achId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(delAch.statusCode).toBe(200);
      expect(delAch.body.data.achievements.length).toBe(0);
    });
  });

  describe('Authorization & Role Access Control for Students Module', () => {
    it('should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/students/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject non-student roles (e.g. recruiter) with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/students/profile')
        .set('Authorization', `Bearer ${recruiterToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Forbidden');
    });
  });
});

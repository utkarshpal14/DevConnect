const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Job = require('../src/models/Job');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  for (const collection of Object.values(mongoose.connection.collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const registerAndLogin = async (email, role = 'recruiter') => {
  await request(app).post('/api/v1/auth/register').send({
    fullName: `${role} user`,
    email,
    password: 'Password123',
    role
  });

  const response = await request(app).post('/api/v1/auth/login').send({
    email,
    password: 'Password123'
  });

  return response.body.data.token;
};

describe('Milestone 3: Recruiter and Job Management', () => {
  it('creates and retrieves a recruiter profile', async () => {
    const token = await registerAndLogin('recruiter@example.com');
    const profileData = {
      companyName: 'DevConnect Labs',
      companyWebsite: 'https://devconnect.example.com',
      companyDescription: 'Developer hiring team',
      location: 'Remote'
    };

    const createResponse = await request(app)
      .post('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${token}`)
      .send(profileData);

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.data.companyName).toBe(profileData.companyName);

    const getResponse = await request(app)
      .get('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.data.companyWebsite).toBe(profileData.companyWebsite);
  });

  it('rejects students from recruiter endpoints', async () => {
    const token = await registerAndLogin('student@example.com', 'student');
    const response = await request(app)
      .get('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('creates a job and lists it with search, filtering, and pagination', async () => {
    const token = await registerAndLogin('jobs@example.com');
    await request(app)
      .post('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ companyName: 'DevConnect Labs', location: 'Remote' });

    const jobData = {
      title: 'Backend Engineer',
      description: 'Build APIs for students',
      requiredSkills: ['Node.js', 'MongoDB'],
      location: 'Remote',
      employmentType: 'Full-Time',
      salaryRange: 'Competitive'
    };

    const createResponse = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send(jobData);

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.data.title).toBe(jobData.title);

    const listResponse = await request(app)
      .get('/api/v1/jobs?search=backend&location=remote&employmentType=Full-Time&page=1&limit=1');

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body.data.jobs).toHaveLength(1);
    expect(listResponse.body.data.pagination).toMatchObject({ page: 1, limit: 1, total: 1 });
  });

  it('prevents a recruiter from changing another recruiter job', async () => {
    const firstToken = await registerAndLogin('first@example.com');
    await request(app)
      .post('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${firstToken}`)
      .send({ companyName: 'First Company' });
    const createResponse = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${firstToken}`)
      .send({
        title: 'Protected Job',
        description: 'Protected description',
        requiredSkills: ['React'],
        location: 'Remote',
        employmentType: 'Internship'
      });

    const secondToken = await registerAndLogin('second@example.com');
    await request(app)
      .post('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${secondToken}`)
      .send({ companyName: 'Second Company' });

    const response = await request(app)
      .put(`/api/v1/jobs/${createResponse.body.data._id}`)
      .set('Authorization', `Bearer ${secondToken}`)
      .send({
        title: 'Unauthorized Update',
        description: 'Changed',
        requiredSkills: ['React'],
        location: 'Remote',
        employmentType: 'Internship'
      });

    expect(response.statusCode).toBe(404);
    expect(await Job.findById(createResponse.body.data._id).then((job) => job.title)).toBe('Protected Job');
  });

  it('closes and deletes a recruiter-owned job', async () => {
    const token = await registerAndLogin('owner@example.com');
    await request(app)
      .post('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ companyName: 'Owner Company' });
    const createResponse = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Closable Job',
        description: 'Job description',
        requiredSkills: ['Express'],
        location: 'Remote',
        employmentType: 'Contract'
      });
    const jobId = createResponse.body.data._id;

    const closeResponse = await request(app)
      .patch(`/api/v1/jobs/${jobId}/close`)
      .set('Authorization', `Bearer ${token}`);
    expect(closeResponse.statusCode).toBe(200);
    expect(closeResponse.body.data.status).toBe('Closed');

    const deleteResponse = await request(app)
      .delete(`/api/v1/jobs/${jobId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.statusCode).toBe(200);
    expect(await Job.findById(jobId)).toBeNull();
  });
});

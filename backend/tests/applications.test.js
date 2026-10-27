const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Application = require('../src/models/Application');
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

const registerAndLogin = async (email, role) => {
  await request(app).post('/api/v1/auth/register').send({
    fullName: `${role} user`,
    email,
    password: 'Password123',
    role
  });
  const response = await request(app).post('/api/v1/auth/login').send({ email, password: 'Password123' });
  return response.body.data.token;
};

const createRecruiterJob = async () => {
  const recruiterToken = await registerAndLogin('recruiter@example.com', 'recruiter');
  await request(app)
    .post('/api/v1/recruiters/profile')
    .set('Authorization', `Bearer ${recruiterToken}`)
    .send({ companyName: 'DevConnect Labs' });
  const response = await request(app)
    .post('/api/v1/jobs')
    .set('Authorization', `Bearer ${recruiterToken}`)
    .send({
      title: 'Backend Engineer',
      description: 'Build APIs',
      requiredSkills: ['Node.js'],
      location: 'Remote',
      employmentType: 'Full-Time'
    });
  return { recruiterToken, job: response.body.data };
};

describe('Milestone 4: Application Management', () => {
  it('allows a student to apply once, view, and withdraw an application', async () => {
    const { job } = await createRecruiterJob();
    const studentToken = await registerAndLogin('student@example.com', 'student');

    const applyResponse = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId: job._id });

    expect(applyResponse.statusCode).toBe(201);
    expect(applyResponse.body.data.status).toBe('Applied');

    const duplicateResponse = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId: job._id });
    expect(duplicateResponse.statusCode).toBe(409);

    const mineResponse = await request(app)
      .get('/api/v1/applications/my')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(mineResponse.statusCode).toBe(200);
    expect(mineResponse.body.data).toHaveLength(1);

    const withdrawResponse = await request(app)
      .patch(`/api/v1/applications/${applyResponse.body.data._id}/withdraw`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(withdrawResponse.statusCode).toBe(200);
    expect(withdrawResponse.body.data.status).toBe('Withdrawn');
  });

  it('allows the job owner to view applicants and update status', async () => {
    const { recruiterToken, job } = await createRecruiterJob();
    const studentToken = await registerAndLogin('applicant@example.com', 'student');
    const applyResponse = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId: job._id });

    const applicantsResponse = await request(app)
      .get(`/api/v1/applications/job/${job._id}`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    expect(applicantsResponse.statusCode).toBe(200);
    expect(applicantsResponse.body.data).toHaveLength(1);

    const statusResponse = await request(app)
      .patch(`/api/v1/applications/${applyResponse.body.data._id}/status`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ status: 'Shortlisted' });
    expect(statusResponse.statusCode).toBe(200);
    expect(statusResponse.body.data.status).toBe('Shortlisted');
  });

  it('prevents a different recruiter from viewing or updating the application', async () => {
    const { job } = await createRecruiterJob();
    const studentToken = await registerAndLogin('protected-student@example.com', 'student');
    const applyResponse = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId: job._id });

    const otherRecruiterToken = await registerAndLogin('other-recruiter@example.com', 'recruiter');
    await request(app)
      .post('/api/v1/recruiters/profile')
      .set('Authorization', `Bearer ${otherRecruiterToken}`)
      .send({ companyName: 'Other Company' });

    const applicantsResponse = await request(app)
      .get(`/api/v1/applications/job/${job._id}`)
      .set('Authorization', `Bearer ${otherRecruiterToken}`);
    expect(applicantsResponse.statusCode).toBe(404);

    const statusResponse = await request(app)
      .patch(`/api/v1/applications/${applyResponse.body.data._id}/status`)
      .set('Authorization', `Bearer ${otherRecruiterToken}`)
      .send({ status: 'Rejected' });
    expect(statusResponse.statusCode).toBe(404);
    expect((await Application.findById(applyResponse.body.data._id)).status).toBe('Applied');
  });

  it('rejects students from recruiter applicant endpoints', async () => {
    const { job } = await createRecruiterJob();
    const studentToken = await registerAndLogin('unauthorized-student@example.com', 'student');
    const response = await request(app)
      .get(`/api/v1/applications/job/${job._id}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.statusCode).toBe(403);
  });

  it('does not allow applications for closed jobs', async () => {
    const { recruiterToken, job } = await createRecruiterJob();
    await request(app)
      .patch(`/api/v1/jobs/${job._id}/close`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    const studentToken = await registerAndLogin('closed-job-student@example.com', 'student');
    const response = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId: job._id });
    expect(response.statusCode).toBe(404);
    expect(await Job.findById(job._id).then((closedJob) => closedJob.status)).toBe('Closed');
  });
});

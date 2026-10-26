const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const CacheService = require('../src/cache/cache.service');
const { memoryStore } = require('../src/config/redis');

let mongoServer;
let recruiterToken;
let studentToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register & login recruiter
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      fullName: 'Cache Recruiter',
      email: 'recruiter.cache@example.com',
      password: 'Password123',
      role: 'recruiter'
    });

  const rLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'recruiter.cache@example.com',
      password: 'Password123'
    });
  recruiterToken = rLogin.body.data.token;

  // Create recruiter profile
  await request(app)
    .post('/api/v1/recruiters/profile')
    .set('Authorization', `Bearer ${recruiterToken}`)
    .send({
      companyName: 'CacheCorp Tech',
      companyWebsite: 'https://cachecorp.example.com',
      companyDescription: 'High performance caching technology'
    });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await CacheService.flush();
});

describe('Redis Cache Service Unit Tests', () => {
  it('should store and retrieve data with get and set', async () => {
    const key = 'test:item:1';
    const data = { id: 1, name: 'Senior Python Engineer', level: 'Senior' };

    await CacheService.set(key, data, 60);
    const retrieved = await CacheService.get(key);

    expect(retrieved).toEqual(data);
  });

  it('should return null on cache miss', async () => {
    const retrieved = await CacheService.get('nonexistent:key:xyz');
    expect(retrieved).toBeNull();
  });

  it('should delete keys using del', async () => {
    const key = 'test:item:to_delete';
    await CacheService.set(key, { active: true }, 60);

    const deleted = await CacheService.del(key);
    expect(deleted).toBe(true);

    const retrieved = await CacheService.get(key);
    expect(retrieved).toBeNull();
  });

  it('should delete keys matching wildcard pattern with delByPattern', async () => {
    await CacheService.set('jobs:1', { title: 'Job 1' }, 60);
    await CacheService.set('jobs:2', { title: 'Job 2' }, 60);
    await CacheService.set('users:1', { name: 'User 1' }, 60);

    const count = await CacheService.delByPattern('jobs:*');
    expect(count).toBe(2);

    expect(await CacheService.get('jobs:1')).toBeNull();
    expect(await CacheService.get('jobs:2')).toBeNull();
    expect(await CacheService.get('users:1')).not.toBeNull();
  });

  it('should expire keys automatically based on TTL', async () => {
    const key = 'test:temp:key';
    // 1-second TTL
    await CacheService.set(key, { temp: true }, 1);

    expect(await CacheService.get(key)).toEqual({ temp: true });

    // Wait 1.1s for expiration
    await new Promise((resolve) => setTimeout(resolve, 1100));

    expect(await CacheService.get(key)).toBeNull();
  });
});

describe('Redis Cache Middleware HTTP Integration Tests', () => {
  it('should return X-Cache: MISS on initial GET /api/v1/jobs, then X-Cache: HIT on second request', async () => {
    // 1. Initial request (Cache Miss)
    const firstRes = await request(app).get('/api/v1/jobs');
    expect(firstRes.statusCode).toBe(200);
    expect(firstRes.headers['x-cache']).toBe('MISS');
    expect(firstRes.body.success).toBe(true);

    // 2. Second request (Cache Hit)
    const secondRes = await request(app).get('/api/v1/jobs');
    expect(secondRes.statusCode).toBe(200);
    expect(secondRes.headers['x-cache']).toBe('HIT');
    expect(secondRes.body).toEqual(firstRes.body);
  });

  it('should invalidate cached jobs when a recruiter creates a new job', async () => {
    // Prime the cache
    const initialGet = await request(app).get('/api/v1/jobs');
    expect(initialGet.headers['x-cache']).toBe('MISS');

    // Confirm cache is HIT
    const cachedGet = await request(app).get('/api/v1/jobs');
    expect(cachedGet.headers['x-cache']).toBe('HIT');

    // Create a new job
    const createRes = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({
        title: 'Full Stack Redis Developer',
        description: 'Build low-latency caching systems and distributed microservices',
        requiredSkills: ['Node.js', 'Redis', 'Docker'],
        location: 'Remote',
        employmentType: 'Full-Time'
      });
    expect(createRes.statusCode).toBe(201);

    // Subsequent GET request should be a MISS due to cache invalidation
    const refreshedGet = await request(app).get('/api/v1/jobs');
    expect(refreshedGet.headers['x-cache']).toBe('MISS');
    expect(refreshedGet.body.data.jobs.some((j) => j.title === 'Full Stack Redis Developer')).toBe(true);
  });
});

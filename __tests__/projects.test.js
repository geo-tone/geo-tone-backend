const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('geo-tone-backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  const mockProject = {
    title: 'My project',
    steps: 8,
    bpm: 90,
    userId: '1',
  };

  const mockUser = {
    username: 'username',
    passwordHash: '123456',
  };

  // POST
  it('creates a row in the projects table', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app).post('/api/v1/projects').send(mockProject);
    expect(res.body).toEqual({ projectId: expect.any(String), ...mockProject });
  });

  // GET PROFILE
  it('gets all projects associated with a single user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);

    await request(app).post('/api/v1/projects').send(mockProject);

    const res = await request(app).get('/api/v1/projects/1');
    expect(res.body).toEqual([
      { projectId: expect.any(String), ...mockProject },
    ]);
  });
});

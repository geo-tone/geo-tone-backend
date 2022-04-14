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
    userId: 1,
  };

  // POST
  it('creates a row in the projects table', async () => {
    const res = await request(app).post('/api/v1/projects').send(mockProject);
    expect(res.body).toEqual({ id: expect.any(String), ...mockProject });
  });
});

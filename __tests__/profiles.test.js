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

  const mockProfile = {
    userId: '2',
    bio: 'bio',
    avatar: 'url',
  };

  it('creates a profile', async () => {
    const res = await request(app).post('/api/v1/profiles').send(mockProfile);
    // not complete
    expect(res.body).toEqual({});
  });
});

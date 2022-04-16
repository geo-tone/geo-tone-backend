const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const agent = request.agent(app);

describe('user routes test', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  const mockUser = {
    username: 'mockusername',
    password: 'mockpassword',
  };

  // CREATE A NEW USER
  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    expect(res.body).toEqual({
      userId: expect.any(String),
      username: 'mockusername',
    });
  });
});

const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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

  // SIGN IN AN EXISTING USER
  it('signs in an existing user', async () => {
    await UserService.create(mockUser);
    const res = await agent.post('/api/v1/users/signin').send(mockUser);
    expect(res.body).toEqual({ message: 'Successfully signed in!' });
  });
});

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
    const res = await agent.post('/api/v1/users/sessions').send(mockUser);
    expect(res.body).toEqual({ message: 'Successfully signed in!' });
  });

  // LOGS OUT A LOGGED IN USER
  it('logs out a user that is logged in', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Successfully logged out!',
    });
  });

  // DELETE A USER
  it('deletes a user from the users table', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.delete(`/api/v1/users/${user.userId}`);
    expect(res.body).toEqual({
      success: true,
      message: 'User account has successfully been deleted!',
    });
  });

  // GET NUMBER OF USERS
  it('gets the number of users in the database', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await request(app).get('/api/v1/users/count');
    expect(Number(res.text)).toEqual(2);
  });

  // PROHIBIT USERS FROM DELETING OTHER USER ACCOUNTS
  it('throws an error when trying to delete another user', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.delete('/api/v1/users/1');
    expect(res.body).toEqual({
      message: 'You are not authorized to modify this user',
      status: 403,
    });
  });
});

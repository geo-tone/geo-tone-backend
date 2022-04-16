const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

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

  const mockUser = {
    username: 'mockusername',
    password: 'mockpassword',
  };

  it('creates a profile', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    // expect(res1.body).toEqual({ message: 'Succussfully signed in!' });
    const res = await agent.post('/api/v1/profiles').send(mockProfile);
    console.log('res.body', res.body);
    expect(res.body).toEqual({ profileId: expect.any(String), ...mockProfile });
  });
});

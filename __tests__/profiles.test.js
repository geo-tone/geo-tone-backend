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

  const seededProfile = {
    userId: '1',
    bio: 'paragon of outsider music, inspiration of tones',
    avatar:
      'https://media2.fdncms.com/portmerc/imager/u/original/19330747/1505926068-music-ttd-paveladyspacelady-terriloewenthal-2.jpg',
  };

  const mockUser = {
    username: 'mockusername',
    password: 'mockpassword',
  };

  // POST
  it('creates a profile', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.post('/api/v1/profiles').send(mockProfile);
    expect(res.body).toEqual({ profileId: expect.any(String), ...mockProfile });
  });

  // GETS ALL PROFILES
  it('gets all profiles', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/profiles').send(mockProfile);
    const res = await agent.get('/api/v1/profiles');
    console.log('res.body', res.body);
    expect(res.body).toEqual([
      { profileId: expect.any(String), ...seededProfile },
      { profileId: expect.any(String), ...mockProfile },
    ]);
  });
});

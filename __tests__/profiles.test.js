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

  const seededProfile = {
    userId: '1',
    username: 'space-lady',
    bio: 'paragon of outsider music, inspiration of tones',
    avatar:
      'https://media2.fdncms.com/portmerc/imager/u/original/19330747/1505926068-music-ttd-paveladyspacelady-terriloewenthal-2.jpg',
  };

  const mockProfile = {
    userId: '2',
    username: 'mockusername',
    bio: 'bio',
    avatar: 'url',
  };

  const mockUser = {
    username: 'mockusername',
    password: 'mockpassword',
  };

  // CREATE A PROFILE
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
    expect(res.body).toEqual([
      { profileId: expect.any(String), ...seededProfile },
      { profileId: expect.any(String), ...mockProfile },
    ]);
  });

  // GETS A PROFILE BY USERNAME
  it('gets a profile by username', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/profiles').send(mockProfile);

    const res = await agent.get(`/api/v1/profiles/${user.username}`);
    expect(res.body).toEqual({ profileId: expect.any(String), ...mockProfile });
  });

  // UPDATES AN EXISTING PROFILE
  it('updates an existing profile by user id', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/profiles').send(mockProfile);

    const res = await agent
      .patch(`/api/v1/profiles/${user.username}`)
      .send({ bio: 'updated bio' });
    expect(res.body).toEqual({
      profileId: expect.any(String),
      ...mockProfile,
      bio: 'updated bio',
    });
  });

  // PROHIBIT USERS FROM EDITING OTHER USER PROFILES
  it('throws an error when trying to edit another user profile', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/profiles').send(mockProfile);

    const res = await agent
      .patch(`/api/v1/profiles/${seededProfile.username}`) // Accessing a different user's profile
      .send({ bio: 'updated bio' });
    expect(res.body).toEqual({
      message: 'You are not authorized to modify this user',
      status: 403,
    });
  });
});

const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Project = require('../lib/models/Project');

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

  const mockChannel1 = {
    projectId: '1',
    title: 'what is the title',
    instrument: {},
    fx: {},
    steps: [],
  };

  const mockChannel2 = {
    projectId: '1',
    title: 'what is the title, really',
    instrument: {},
    fx: {},
    steps: [],
  };

  // POST
  it('creates a channel into a project', async () => {
    const project = await Project.insert(mockProject);
    const res = await request(app)
      .post(`/api/v1/channels/${project.projectId}`)
      .send(mockChannel1);
    expect(res.body).toEqual({
      channelId: expect.any(String),
      ...mockChannel1,
    });
  });

  // GET ALL CHANNELS BY PROJECT ID
  it('gets all channels by a project id', async () => {
    const project = await Project.insert(mockProject);
    await request(app)
      .post(`/api/v1/channels/${project.projectId}`)
      .send(mockChannel1);
    await request(app)
      .post(`/api/v1/channels/${project.projectId}`)
      .send(mockChannel2);
    const res = await request(app).get(
      `/api/v1/channels/project/${project.projectId}`
    );
    expect(res.body).toEqual([
      { channelId: expect.any(String), ...mockChannel1 },
      { channelId: expect.any(String), ...mockChannel2 },
    ]);
  });

  // GET CHANNEL BY CHANNEL ID
  it('get a channel by channel id', async () => {
    const project = await Project.insert(mockProject);
    await request(app)
      .post(`/api/v1/channels/${project.projectId}`)
      .send(mockChannel1);
    const res = await request(app).get('/api/v1/channels//1');
    expect(res.body).toEqual({
      channelId: expect.any(String),
      ...mockChannel1,
    });
  });
});

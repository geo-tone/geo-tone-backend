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

  const mockChannel = {
    projectId: '1',
    title: 'what is the title',
    instrument: {},
    fx: {},
    steps: [],
  };

  // POST
  it('creates a channel into a project', async () => {
    const project = await Project.insert(mockProject);
    const res = await request(app)
      .post(`/api/v1/channels/${project.projectId}`)
      .send(mockChannel);
    expect(res.body).toEqual({
      channelId: expect.any(String),
      ...mockChannel,
    });
  });
});

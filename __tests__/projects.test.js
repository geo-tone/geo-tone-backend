const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Project = require('../lib/models/Project');
const Channel = require('../lib/models/Channel');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

describe('geo-tone-backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  const mockProject = {
    userId: '2',
    title: 'My mock project',
    volume: -2,
    bpm: 200,
    channels: [],
  };

  const mockUser = {
    username: 'username',
    password: '123456',
  };

  const seededProject = {
    userId: '1',
    title: 'our seeded project',
    volume: 0,
    bpm: 90,
    channels: [
      '{ "id": 0, "type": "synth", "osc": "sine", "steps": [null, null, null, null, null, null, null, null], "volume": -5, "reverb": 0.5 }',
    ],
  };

  // POST
  it('creates a row in the projects table', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.post('/api/v1/projects').send(mockProject);
    expect(res.body).toEqual({
      projectId: expect.any(String),
      userId: expect.any(String),
      ...mockProject,
    });
  });

  // GET ALL PROJECTS BY USER ID
  it('gets all projects associated with a single user_id', async () => {
    // await request(app).post('/api/v1/users').send(mockUser);

    await request(app).post('/api/v1/projects').send(mockProject);
    const res = await request(app).get('/api/v1/projects/user/1');
    expect(res.body).toEqual([
      { projectId: expect.any(String), ...seededProject },
      { projectId: expect.any(String), ...mockProject },
    ]);
  });

  // GET INDIVIDUAL PROJECT BY PROJECT ID
  it('gets an individual project asociated with a project_id', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    await request(app).post('/api/v1/projects').send(mockProject);
    const res = await request(app).get('/api/v1/projects/2');
    expect(res.body).toEqual({ projectId: expect.any(String), ...mockProject });
  });

  // EDIT A PROJECT BY PROJECT ID
  it('modifies a project by project id', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const project = await Project.insert(mockProject);
    const res = await request(app)
      .patch(`/api/v1/projects/${project.projectId}`)
      .send({ title: 'new title' });
    expect(res.body).toEqual({ ...project, title: 'new title' });
  });

  // DELETE A PROJECT BY PROJECT ID
  it('deletes a project by project id', async () => {
    await Channel.insert('1', {
      title: 'still not sure',
      steps: [],
      instrument: {},
      fx: {},
    });
    const res = await request(app).delete('/api/v1/projects/1');
    expect(res.body).toEqual({ message: 'Successfully deleted project' });
  });
});

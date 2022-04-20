const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Project = require('../lib/models/Project');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

describe('geo-tone-backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  const mockUser = {
    username: 'username',
    password: '123456',
  };

  const mockNewProject = {
    title: 'untitled',
    volume: -12,
    bpm: 120,
    channels: [
      '{ "id": 0, "type": "synth", "osc": "sine", "steps": [null, null, null, null, null, null, null, null], "volume": -5, "reverb": 0.5" }',
    ],
  };

  const mockProject = {
    userId: '2',
    title: 'My mock project',
    volume: -2,
    bpm: 200,
    channels: [
      '{ "id": 0, "type": "synth", "osc": "sine", "steps": [null, null, null, null, null, null, null, null], "volume": -5, "reverb": 0.5 }',
    ],
  };

  const mockProject2 = {
    userId: '2',
    title: 'our seeded project',
    volume: 0,
    bpm: 90,
    channels: [
      '{ "id": 0, "type": "synth", "osc": "sine", "steps": [null, null, null, null, null, null, null, null], "volume": -5, "reverb": 0.5 }',
    ],
  };

  // POST
  it('creates a row in the projects table', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.post('/api/v1/projects').send(user.userId);
    expect(res.body).toEqual({
      projectId: expect.any(String),
      userId: expect.any(String),
      ...mockNewProject,
    });
  });

  // GET ALL PROJECTS BY USER ID
  it('gets all projects associated with a single user_id', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/projects').send(mockProject2);
    await agent.post('/api/v1/projects').send(mockProject);

    const res = await agent.get(`/api/v1/projects/user/${user.userId}`);
    expect(res.body).toEqual([
      { projectId: expect.any(String), ...mockProject2 },
      { projectId: expect.any(String), ...mockProject },
    ]);
  });

  // GET INDIVIDUAL PROJECT BY PROJECT ID
  it('gets an individual project asociated with a project_id', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const project = await agent.post('/api/v1/projects').send(mockProject);
    const res = await agent.get(`/api/v1/projects/${project.body.projectId}`);
    expect(res.body).toEqual({ projectId: expect.any(String), ...mockProject });
  });

  // EDIT A PROJECT BY PROJECT ID
  it('modifies a project by project id', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const project = await Project.insert(mockProject);
    const res = await agent
      .patch(`/api/v1/projects/${project.projectId}`)
      .send({ title: 'new title' });
    expect(res.body).toEqual({ ...project, title: 'new title' });
  });

  // DELETE A PROJECT BY PROJECT ID
  it('deletes a project by project id', async () => {
    await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const project = await Project.insert(mockProject);
    const res = await agent.delete(`/api/v1/projects/${project.projectId}`);
    expect(res.body).toEqual({ message: 'Successfully deleted project' });
  });
});

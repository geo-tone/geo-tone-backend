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

  const mockProject = {
    userId: '2',
    title: 'untitled',
    volume: -48,
    bpm: 180,
    channels: [
      '{ "id": 0, "type": "monoSynth", "osc": "triangle", "steps": [null, null, null, null, null, null, null, null], "volume": -6, "reverb": 0.1 }',
    ],
  };

  // POST
  it('creates a row in the projects table', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.post('/api/v1/projects').send(user.userId);
    expect(res.body).toEqual({
      projectId: expect.any(String),
      ...mockProject,
    });
  });

  // GET ALL PROJECTS
  it('gets all projects in the table', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/projects').send(user.userId);
    await agent.post('/api/v1/projects').send(user.userId);

    const res = await request(app).get('/api/v1/projects');
    expect(res.body).toHaveLength(3);
  });

  // GET ALL PROJECTS BY USER ID
  it('gets all projects associated with a single user_id', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/projects').send(user.userId);
    await agent.post('/api/v1/projects').send(user.userId);

    const res = await agent.get(`/api/v1/projects/user/${user.userId}`);
    expect(res.body).toEqual([
      { projectId: expect.any(String), ...mockProject },
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
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const project = await Project.insert(user.userId);
    const res = await agent
      .patch(`/api/v1/projects/${project.projectId}`)
      .send({ title: 'new title' });
    expect(res.body).toEqual({ ...project, title: 'new title' });
  });

  // DELETE A PROJECT BY PROJECT ID
  it('deletes a project by project id', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const project = await Project.insert(user.userId);
    const res = await agent.delete(`/api/v1/projects/${project.projectId}`);
    expect(res.body).toEqual({ message: 'Successfully deleted project' });
  });

  // GET NUMBER OF PROJECTS
  it('gets the number of projects in the database', async () => {
    const user = await UserService.create(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    await agent.post('/api/v1/projects').send(user.userId);
    await agent.post('/api/v1/projects').send(user.userId);

    const res = await request(app).get('/api/v1/projects/count');
    expect(Number(res.text)).toEqual(3);
  });
});

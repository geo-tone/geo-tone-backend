const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Project = require('../lib/models/Project');
const Channel = require('../lib/models/Channel');

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

  const mockUser = {
    username: 'username',
    passwordHash: '123456',
  };

  const seededProject = {
    title: 'our seeded project',
    steps: 8,
    bpm: 90,
    userId: '1',
  };

  // POST
  it('creates a row in the projects table', async () => {
    // await request(app).post('/api/v1/users').send(mockUser);

    const res = await request(app).post('/api/v1/projects').send(mockProject);
    expect(res.body).toEqual({ projectId: expect.any(String), ...mockProject });
  });

  // GET PROJECTS BY USER ID
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

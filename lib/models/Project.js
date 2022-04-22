const pool = require('../utils/pool');

module.exports = class Project {
  projectId;
  userId;
  title;
  volume;
  bpm;
  channels;

  constructor(row) {
    this.projectId = row.project_id;
    this.userId = row.user_id;
    this.title = row.title;
    this.volume = row.volume;
    this.bpm = row.bpm;
    this.channels = row.channels;
  }

  static async insert(userId) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        projects(user_id)
      VALUES
        ($1)
      RETURNING
         *
      `,
      [userId]
    );
    return new Project(rows[0]);
  }

  static async findAllProjects() {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        projects
      `
    );
    return rows.map((row) => new Project(row));
  }

  static async findProjectById(projectId) {
    const { rows } = await pool.query(
      `SELECT
        *
      FROM
        projects
      WHERE
        project_id = $1
      `,
      [projectId]
    );
    if (!rows[0]) return null;
    return new Project(rows[0]);
  }

  static async findProjectsByUserId(userId) {
    const { rows } = await pool.query(
      `SELECT 
        *
      FROM
        projects
      WHERE
        user_id = $1
      `,
      [userId]
    );
    if (!rows[0]) return null;
    return rows.map((row) => new Project(row));
  }

  static async updateByProjectId(projectId, attributes) {
    const originalProject = await Project.findProjectById(projectId);
    if (!originalProject) return null;
    const { userId, title, volume, bpm, channels } = {
      ...originalProject,
      ...attributes,
    };
    const { rows } = await pool.query(
      `
      UPDATE
        projects
      SET
        user_id = $1,
        title = $2,
        volume = $3,
        bpm = $4,
        channels = $5
      WHERE
        project_id = $6
      RETURNING
        *
      `,
      [userId, title, volume, bpm, channels, projectId]
    );
    if (!rows[0]) return null;
    return new Project(rows[0]);
  }

  static async deleteByProjectId(projectId) {
    const { rows } = await pool.query(
      `
      DELETE FROM 
        projects
      WHERE
        project_id=$1
      RETURNING
      *
      `,
      [projectId]
    );
    if (!rows[0]) return null;
    return new Project(rows[0]);
  }

  static async findNumberOfProjects() {
    const { rows } = await pool.query(
      `
      SELECT COUNT
        (*) 
      FROM 
        projects
      `
    );
    return rows[0].count;
  }
};

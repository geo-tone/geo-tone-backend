const pool = require('../utils/pool');

module.exports = class Project {
  projectId;
  userId;
  title;
  steps;
  bpm;

  constructor(row) {
    this.projectId = row.project_id;
    this.userId = row.user_id;
    this.title = row.title;
    this.steps = row.steps;
    this.bpm = row.bpm;
  }

  static async insert({ userId, title, steps, bpm }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          projects(user_id, title, steps, bpm)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *
    `,
      [userId, title, steps, bpm]
    );
    return new Project(rows[0]);
  }

  static async findProjectById(projectId) {
    const { rows } = await pool.query(
      `SELECT
        *
      FROM
        projects
      WHERE
        project_id = $1`,
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
        user_id = $1`,
      [userId]
    );

    if (!rows[0]) return null;

    return rows.map((row) => new Project(row));
  }

  static async updateByProjectId(projectId, attributes) {
    const originalProject = await Project.findProjectById(projectId);
    if (!originalProject) return null;
    const { userId, title, steps, bpm } = {
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
          steps = $3,
          bpm = $4
        WHERE
          project_id = $5
        RETURNING
          *
    `,
      [userId, title, steps, bpm, projectId]
    );
    return new Project(rows[0]);
  }
};

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
          *;
    `,
      [userId, title, steps, bpm]
    );
    return new Project(rows[0]);
  }
};

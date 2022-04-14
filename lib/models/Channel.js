const pool = require('../utils/pool');

module.exports = class Channel {
  channelId;
  projectId;
  title;
  instrument;
  fx;
  steps;

  constructor(row) {
    this.channelId = row.channel_id;
    this.projectId = row.project_id;
    this.title = row.title;
    this.instrument = row.instrument;
    this.fx = row.fx;
    this.steps = row.steps;
  }

  static async insert(projectId, { title, instrument, fx, steps }) {
    const { rows } = await pool.query(
      `INSERT INTO 
            channels(project_id, title, instrument, fx, steps)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING
            *`,
      [projectId, title, instrument, fx, steps]
    );
    return new Channel(rows[0]);
  }
};

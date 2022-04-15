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

  static async findChannelsByProjectId(projectId) {
    const { rows } = await pool.query(
      `SELECT
          *
        FROM
          channels
        WHERE
          project_id = $1`,
      [projectId]
    );
    if (!rows[0]) return null;
    return rows.map((row) => new Channel(row));
  }

  static async findChannelByChannelId(channelId) {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          channels
        WHERE
          channel_id = $1
      `,
      [channelId]
    );
    if (!rows[0]) return null;
    return new Channel(rows[0]);
  }

  static async updateByChannelId(channelId, attributes) {
    const originalChannel = await Channel.findChannelByChannelId(channelId);
    if (!originalChannel) return null;
    const { projectId, title, instrument, fx, steps } = {
      ...originalChannel,
      ...attributes,
    };
    const { rows } = await pool.query(
      `
        UPDATE
           channels
        SET
           project_id = $1,
           title = $2,
           instrument = $3,
           fx = $4,
           steps = $5
        WHERE
          channel_id = $6
        RETURNING
          *
      `,
      [projectId, title, instrument, fx, steps, channelId]
    );
    return new Channel(rows[0]);
  }

  static async deleteByChannelId(channelId) {
    const { rows } = await pool.query(
      `
      DELETE FROM
        channels
      WHERE
        channel_id=$1
      RETURNING
        *
      `,
      [channelId]
    );
    if (!rows[0]) return null;
    return new Channel(rows[0]);
  }
};

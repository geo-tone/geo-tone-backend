const pool = require('../utils/pool');

module.exports = class User {
  userId;
  username;
  #passwordHash;
  createdAt;

  constructor(row) {
    this.userId = row.user_id;
    this.username = row.username;
    this.#passwordHash = row.password_hash;
    this.createdAt = row.rceated_at;
  }

  static async insert({ username, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        users(username, password_hash)
      VALUES
        ($1, $2)
      RETURNING
        *;
    `,
      [username, passwordHash]
    );
    return new User(rows[0]);
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      `SELECT
        *
      FROM
        users
      WHERE
        username=$1`,
      [username]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async deleteUser(userId) {
    const { rows } = await pool.query(
      `
      DELETE FROM
        users
      WHERE
        user_id=$1
      RETURNING
        *`,
      [userId]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }

  // set passwordHash(newHash) {
  //   this.#passwordHash = newHash;
  // }
};

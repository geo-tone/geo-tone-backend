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
};
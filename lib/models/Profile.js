const pool = require('../utils/pool');

module.exports = class Profile {
  profileId;
  userId;
  username;
  bio;
  avatar;

  constructor(row) {
    this.profileId = row.profile_id;
    this.userId = row.user_id;
    this.username = row.username;
    this.bio = row.bio;
    this.avatar = row.avatar;
  }

  static async insert({ userId, username, bio, avatar }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          profiles(user_id, username, bio, avatar)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *;
        `,
      [userId, username, bio, avatar]
    );
    return new Profile(rows[0]);
  }

  static async findAllProfiles() {
    const { rows } = await pool.query(
      `
      SELECT 
        *
      FROM
        profiles
      INNER JOIN  
        users
      ON
        profiles.user_id = users.user_id
      `
    );
    return rows.map((row) => new Profile(row));
  }

  static async findProfileByUsername(username) {
    const { rows } = await pool.query(
      `
      SELECT 
        *
      FROM
        profiles
      INNER JOIN  
        users
      ON
        profiles.username = users.username
      WHERE
        profiles.username = $1
      `,
      [username]
    );
    if (!rows[0]) return null;
    return new Profile(rows[0]);
  }

  static async updateByUsername(username, attributes) {
    const originalProfile = await Profile.findProfileByUsername(username);
    if (!originalProfile) return null;
    const { bio, avatar } = {
      ...originalProfile,
      ...attributes,
    };
    const { rows } = await pool.query(
      `
      UPDATE
        profiles
      SET
        bio = $1, 
        avatar = $2
      WHERE
        username = $3
      RETURNING
        *
      `,
      [bio, avatar, username]
    );
    if (!rows[0]) return null;
    return new Profile(rows[0]);
  }
};

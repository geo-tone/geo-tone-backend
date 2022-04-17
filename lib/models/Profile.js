const pool = require('../utils/pool');

module.exports = class Profile {
  profileId;
  userId;
  bio;
  avatar;

  constructor(row) {
    this.profileId = row.profile_id;
    this.userId = row.user_id;
    this.bio = row.bio;
    this.avatar = row.avatar;
  }

  static async insert({ userId, bio, avatar }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          profiles(user_id, bio, avatar)
        VALUES
          ($1, $2, $3)
        RETURNING
          *;
        `,
      [userId, bio, avatar]
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

  static async findProfileByUserId(userId) {
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
      WHERE
        profiles.user_id = $1
      `,
      [userId]
    );
    if (!rows[0]) return null;
    return new Profile(rows[0]);
  }

  static async updateByUserId(userId, attributes) {
    const originalProfile = await Profile.findProfileByUserId(userId);
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
        user_id = $3
      RETURNING
        *
      `,
      [bio, avatar, userId]
    );
    if (!rows[0]) return null;
    return new Profile(rows[0]);
  }
};

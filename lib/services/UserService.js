const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, password }) {
    let user = await User.findByUsername(username);
    if (user) {
      throw new Error('username already exists');
    }
    if (!user) {
      const passwordHash = bcrypt.hashSync(
        password,
        Number(process.env.SALT_ROUNDS)
      );
      user = await User.insert({ username, passwordHash });
    }
    return user;
  }

  static async signIn({ username, password }) {
    const user = await User.findByUsername(username);
    if (!user) throw new Error('invalid username/password');
    const passwordsMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordsMatch) throw new Error('invalid username/password');
    const webToken = jwt.sign({ ...user }, process.env.JWT_SECRET);
    return webToken;
  }
};

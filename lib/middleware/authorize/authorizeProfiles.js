const Profile = require('../../models/Profile');

module.exports = async (req, res, next) => {
  try {
    const { username } = req.user;
    const profile = await Profile.findProfileByUsername(req.params.username);
    if (username !== profile.username) throw new Error();
    next();
  } catch (error) {
    error.message = 'You are not authorized to modify this user';
    error.status = 403;
    next(error);
  }
};

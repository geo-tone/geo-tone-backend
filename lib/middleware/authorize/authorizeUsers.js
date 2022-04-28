const User = require('../../models/User');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findByUserId(req.params.user_id);
    if (userId !== user.userId) throw new Error();
    next();
  } catch (error) {
    error.message = 'You are not authorized to modify this user';
    error.status = 403;
    next(error);
  }
};

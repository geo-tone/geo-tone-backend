import User from '../models/User';
module.exports = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findByUserId(req.params.user_id);
    if (userId !== user.userId) throw new Error();
    next();
  } catch (error) {
    error.message = 'You are not authorized to delete this user';
    next(error);
  }
};

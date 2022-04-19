const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    console.log('cookie', cookie);
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    console.log('payload', payload);
    req.user = payload;
    console.log('req.user', req.user);
    next();
  } catch (error) {
    error.message = 'You must sign in to continue.';
    error.status = 401;
    next(error);
  }
};

const { Router } = require('express');
const UserService = require('../services/UserService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  //POST
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/signin', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userToken = await UserService.signIn({ username, password });
      console.log('userToken', userToken);
      res
        .cookie(process.env.COOKIE_NAME, userToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({
          message: 'Successfully signed in!',
        });
    } catch (error) {
      next(error);
    }
  });

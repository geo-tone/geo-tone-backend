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

  .post('/sessions', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userToken = await UserService.signIn({ username, password });
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
  })

  // LOG OUT
  .delete('/sessions', async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        http: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .json({ success: true, message: 'Successfully logged out!' });
  });

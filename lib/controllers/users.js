const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize/authorizeUsers');
const User = require('../models/User');
const UserService = require('../services/UserService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IS_DEPLOYED = process.env.NODE_ENV === 'production';

module.exports = Router()

  //CREATE A USER
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  // LOG IN A USER & COOKIES
  .post('/sessions', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userToken = await UserService.signIn({ username, password });
      res
        .cookie(process.env.COOKIE_NAME, userToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          secure: IS_DEPLOYED,
        })
        .json({
          message: 'Successfully signed in!',
        });
    } catch (error) {
      next(error);
    }
  })

  // GETS NUMBER OF USERS
  .get('/count', async (req, res, next) => {
    try {
      const users = await User.findNumberOfUsers();
      res.send(users);
    } catch (error) {
      next(error);
    }
  })

  // GET A LOGGED IN USER, FROM COOKIE INFO
  .get('/me', authenticate, async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })

  // LOG OUT
  .delete('/sessions', authenticate, async (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
        sameSite: IS_DEPLOYED ? 'none' : 'strict',
        secure: IS_DEPLOYED,
      })
      .json({ success: true, message: 'Successfully logged out!' });
  })

  // DELETE A USER
  .delete('/:user_id', authenticate, authorize, async (req, res, next) => {
    try {
      await User.deleteUser(req.params.user_id);
      res
        .clearCookie(process.env.COOKIE_NAME, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          secure: IS_DEPLOYED,
        })
        .send({
          success: true,
          message: 'User account has successfully been deleted!',
        });
    } catch (error) {
      next(error);
    }
  });

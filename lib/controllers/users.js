const { Router } = require('express');
const UserService = require('../services/UserService');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');

const IS_DEPLOYED = process.env.NODE_ENV === 'production';

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
        http: true,
        maxAge: ONE_DAY_IN_MS,
        sameSite: IS_DEPLOYED ? 'none' : 'strict',
        secure: IS_DEPLOYED,
        domain: 'geo-tone-staging.herokuapp.com',
        path: '/',
      })
      .json({ success: true, message: 'Successfully logged out!' });
  })

  // DELETE A USER
  .delete('/:user_id', authenticate, async (req, res, next) => {
    try {
      await User.deleteUser(req.params.user_id);
      res
        .clearCookie(process.env.COOKIE_NAME, {
          http: true,
          maxAge: ONE_DAY_IN_MS,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          secure: IS_DEPLOYED,
          domain: 'geo-tone-staging.herokuapp.com',
          path: '/',
        })
        .send({
          success: true,
          message: 'User account has successfully been deleted!',
        });
    } catch (error) {
      next(error);
    }
  });

const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports = Router()
  // CREATE PROFILE
  .post('/', authenticate, async (req, res, next) => {
    try {
      const profile = await Profile.insert(req.body);
      res.send(profile);
    } catch (error) {
      next(error);
    }
  })

  // GET ALL PROFILES
  .get('/', async (req, res, next) => {
    try {
      const profiles = await Profile.findAllProfiles();
      res.send(profiles);
    } catch (error) {
      next(error);
    }
  })

  // GET A LOGGED IN PROFILE BY ID
  .get('/user/me', authenticate, async (req, res, next) => {
    console.log('req.user', req.user);
    try {
      const user = await User.findByUserId(req.user.userId);
      console.log('profile', user);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  // GET A PROFILE BY ID
  .get('/:user_id', authenticate, async (req, res, next) => {
    try {
      const profile = await Profile.findProfileByUserId(req.params.user_id);
      res.send(profile);
    } catch (error) {
      next(error);
    }
  })

  //UPDATES A PROFILE
  .patch('/:user_id', authenticate, async (req, res, next) => {
    try {
      const profile = await Profile.updateByUserId(
        req.params.user_id,
        req.body
      );
      res.send(profile);
    } catch (error) {
      next(error);
    }
  });

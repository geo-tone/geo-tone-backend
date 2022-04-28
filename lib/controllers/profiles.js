const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize/authorizeProfiles.js');
const Profile = require('../models/Profile');

module.exports = Router()
  // CREATE PROFILE
  .post('/', authenticate, async (req, res, next) => {
    try {
      const profile = await Profile.insert({
        ...req.body,
        userId: req.user.userId,
        username: req.user.username,
      });
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

  // GET A PROFILE BY USERNAME
  .get('/:username', authenticate, async (req, res, next) => {
    try {
      const profile = await Profile.findProfileByUsername(req.params.username);
      if (!profile) res.send({ message: 'this user has no profile' });
      res.send(profile);
    } catch (error) {
      next(error);
    }
  })

  //UPDATES A PROFILE
  .patch('/:username', authenticate, authorize, async (req, res, next) => {
    try {
      const profile = await Profile.updateByUsername(
        req.params.username,
        req.body
      );
      res.send(profile);
    } catch (error) {
      next(error);
    }
  });

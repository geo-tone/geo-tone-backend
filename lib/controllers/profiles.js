const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
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
      res.send(profile);
    } catch (error) {
      next(error);
    }
  })

  //UPDATES A PROFILE
  .patch('/:username', authenticate, async (req, res, next) => {
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

const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Profile = require('../models/Profile');

module.exports = Router()
  // CREATE PROFILE
  .post('/', authenticate, async (req, res, next) => {
    try {
      const profile = await Profile.insert(req.body);
      res.send(profile);
    } catch (error) {
      next(error);
    }
  });

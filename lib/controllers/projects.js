const { Router } = require('express');
const Project = require('../models/Project');

module.exports = Router()
  // POST
  .post('/', async (req, res, next) => {
    try {
      const project = await Project.insert(req.body);
      res.send(project);
    } catch (error) {
      next(error);
    }
  });

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
  })

  .get('/:project_id', async (req, res, next) => {
    try {
      const project = await Project.findProjectById(req.params.project_id);
      res.send(project);
    } catch (error) {
      next(error);
    }
  })

  .get('/user/:user_id', async (req, res, next) => {
    try {
      const userProjects = await Project.findProjectsByUserId(
        req.params.user_id
      );
      res.send(userProjects);
    } catch (error) {
      next(error);
    }
  });

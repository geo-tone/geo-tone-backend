const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize/authorizeProjects');
const Project = require('../models/Project');

module.exports = Router()
  // CREATE A PROJECT
  .post('/', authenticate, async (req, res, next) => {
    try {
      const project = await Project.insert(req.user.userId);
      res.send(project);
    } catch (error) {
      next(error);
    }
  })

  // GET ALL PROJECTS
  .get('/', async (req, res, next) => {
    try {
      const projects = await Project.findAllProjects();
      res.send(projects);
    } catch (error) {
      next(error);
    }
  })

  // GETS NUMBER OF PROJECTS
  .get('/count', async (req, res, next) => {
    try {
      const projects = await Project.findNumberOfProjects();
      res.send(projects);
    } catch (error) {
      next(error);
    }
  })

  // GET INDIVIDUAL PROJECT BY PROJECT ID
  .get('/:project_id', async (req, res, next) => {
    try {
      const project = await Project.findProjectById(req.params.project_id);
      res.send(project);
    } catch (error) {
      next(error);
    }
  })

  // GET ALL PROJECTS BY USER ID
  .get('/user/:user_id', authenticate, async (req, res, next) => {
    try {
      const userProjects = await Project.findProjectsByUserId(
        req.params.user_id
      );
      if (!userProjects) res.send({ message: 'this user has no projects' });
      res.send(userProjects);
    } catch (error) {
      next(error);
    }
  })

  // EDIT PROJECT BY PROJECT ID
  .patch('/:project_id', authenticate, authorize, async (req, res, next) => {
    try {
      const project = await Project.updateByProjectId(
        req.params.project_id,
        req.body
      );
      res.send(project);
    } catch (error) {
      next(error);
    }
  })

  // DELETE PROJECT BY PROJECT ID
  .delete('/:project_id', authenticate, authorize, async (req, res, next) => {
    try {
      await Project.deleteByProjectId(req.params.project_id);
      res.send({ message: 'Successfully deleted project' });
    } catch (error) {
      next(error);
    }
  });

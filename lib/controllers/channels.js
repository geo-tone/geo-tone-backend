const { Router } = require('express');
const Channel = require('../models/Channel');

module.exports = Router()
  // POST
  .post('/:project_id', async (req, res, next) => {
    try {
      const channel = await Channel.insert(req.params.project_id, req.body);
      res.send(channel);
    } catch (error) {
      next(error);
    }
  })

  // GET
  .get('/:project_id', async (req, res, next) => {
    try {
      const channels = await Channel.findChannelsByProjectId(
        req.params.project_id
      );
      res.send(channels);
    } catch (error) {
      next(error);
    }
  });

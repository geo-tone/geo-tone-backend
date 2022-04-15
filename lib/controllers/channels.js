const { Router } = require('express');
const Channel = require('../models/Channel');

module.exports = Router()
  // POST
  .post('/project/:project_id', async (req, res, next) => {
    try {
      const channel = await Channel.insert(req.params.project_id, req.body);
      res.send(channel);
    } catch (error) {
      next(error);
    }
  })

  // GET ALL CHANNELS ASSOCIATED WITH A PROJECT
  .get('/project/:project_id', async (req, res, next) => {
    try {
      const channels = await Channel.findChannelsByProjectId(
        req.params.project_id
      );
      res.send(channels);
    } catch (error) {
      next(error);
    }
  })

  // GET INDIVIDUAL CHANNEL BY CHANNEL ID
  .get('/:channel_id', async (req, res, next) => {
    try {
      const channel = await Channel.findChannelByChannelId(
        req.params.channel_id
      );
      res.send(channel);
    } catch (error) {
      next(error);
    }
  })

  // EDIT AN INDIVIDUAL CHANNEL BY CHANNEL ID
  .patch('/:channel_id', async (req, res, next) => {
    try {
      const channel = await Channel.updateByChannelId(
        req.params.channel_id,
        req.body
      );
      res.send(channel);
    } catch (error) {
      next(error);
    }
  });

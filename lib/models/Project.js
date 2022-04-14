const pool = require('../utils/pool');

module.exports = class Project {
  id;
  userId;
  title;
  steps;
  bpm;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.title = row.title;
    this.steps = row.steps;
    this.bpm = row.bpm;
  }
};

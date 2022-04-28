const Project = require('../../models/Project');

module.exports = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const project = await Project.findProjectById(req.params.project_id);
    if (userId !== project.userId) throw new Error();
    next();
  } catch (error) {
    error.message = 'You are not authorized to modify this project';
    error.status = 403;
    next(error);
  }
};

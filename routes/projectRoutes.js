const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getHomeProjects,
  toggleHomePage
} = require('../controllers/projectController');

// Get all projects
router.get('/', getProjects);

// Get home page projects
router.get('/home', getHomeProjects);

// Get single project
router.get('/:id', getProject);

// Create project
router.post('/', createProject);

// Update project
router.put('/:id', updateProject);

// Delete project
router.delete('/:id', deleteProject);

// Toggle home page status
router.patch('/:id/toggle-home', toggleHomePage);

module.exports = router;
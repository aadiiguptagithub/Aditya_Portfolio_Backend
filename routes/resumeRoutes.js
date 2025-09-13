const express = require('express');
const {
  getResume,
  updateResume,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  addProject,
  deleteProject
} = require('../controllers/resumeController');

const router = express.Router();

// GET /api/resume - Get resume data
router.get('/', getResume);

// PUT /api/resume - Update resume data
router.put('/', updateResume);

// POST /api/resume/experience - Add experience
router.post('/experience', addExperience);

// PUT /api/resume/experience/:index - Update experience
router.put('/experience/:index', updateExperience);

// DELETE /api/resume/experience/:index - Delete experience
router.delete('/experience/:index', deleteExperience);

// POST /api/resume/education - Add education
router.post('/education', addEducation);

// DELETE /api/resume/education/:index - Delete education
router.delete('/education/:index', deleteEducation);

// POST /api/resume/projects - Add project
router.post('/projects', addProject);

// DELETE /api/resume/projects/:index - Delete project
router.delete('/projects/:index', deleteProject);

module.exports = router;
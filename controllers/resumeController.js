const Resume = require('../models/Resume');

// Get resume data
const getResume = async (req, res) => {
  try {
    let resume = await Resume.findOne();
    
    if (!resume) {
      // Create default resume if none exists
      resume = new Resume({
        personalInfo: {
          name: 'Your Name',
          title: 'Your Title',
          email: 'your.email@example.com',
          phone: '+1 (555) 123-4567',
          github: 'https://github.com/username',
          linkedin: 'https://linkedin.com/in/username',
          profileImage: ''
        },
        about: 'Write about yourself here...',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [],
        education: [],
        projects: []
      });
      await resume.save();
    }
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update resume data
const updateResume = async (req, res) => {
  try {
    const resumeData = req.body;
    
    let resume = await Resume.findOne();
    
    if (!resume) {
      resume = new Resume(resumeData);
    } else {
      Object.assign(resume, resumeData);
    }
    
    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add experience
const addExperience = async (req, res) => {
  try {
    const { title, period, achievements } = req.body;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    resume.experience.push({ title, period, achievements });
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update experience
const updateExperience = async (req, res) => {
  try {
    const { index } = req.params;
    const { title, period, achievements } = req.body;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (index >= resume.experience.length) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    resume.experience[index] = { title, period, achievements };
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete experience
const deleteExperience = async (req, res) => {
  try {
    const { index } = req.params;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (index >= resume.experience.length) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    resume.experience.splice(index, 1);
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add education
const addEducation = async (req, res) => {
  try {
    const { degree, institution, period, gpa } = req.body;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    resume.education.push({ degree, institution, period, gpa });
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete education
const deleteEducation = async (req, res) => {
  try {
    const { index } = req.params;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (index >= resume.education.length) {
      return res.status(404).json({ message: 'Education not found' });
    }
    
    resume.education.splice(index, 1);
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add project
const addProject = async (req, res) => {
  try {
    const { name, description, technologies, link } = req.body;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    resume.projects.push({ name, description, technologies, link });
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { index } = req.params;
    
    let resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (index >= resume.projects.length) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    resume.projects.splice(index, 1);
    await resume.save();
    
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getResume,
  updateResume,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  addProject,
  deleteProject
};
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  personalInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    github: {
      type: String,
      required: true,
      trim: true
    },
    linkedin: {
      type: String,
      required: true,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    }
  },
  about: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: [{
    title: {
      type: String,
      required: true
    },
    period: {
      type: String,
      required: true
    },
    achievements: [{
      type: String
    }]
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    period: {
      type: String,
      required: true
    },
    gpa: {
      type: String,
      required: true
    }
  }],
  projects: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    technologies: [{
      type: String
    }],
    link: {
      type: String,
      default: ''
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
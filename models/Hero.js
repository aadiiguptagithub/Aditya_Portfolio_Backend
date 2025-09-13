const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
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
  profileImage: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  socialLinks: {
    github: {
      type: String,
      required: true
    },
    linkedin: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);
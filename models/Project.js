const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [{
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue-text-gradient'
    }
  }],
  image: {
    type: String,
    required: true
  },
  source_code_link: {
    type: String,
    required: true
  },
  live_demo_link: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Featured'],
    default: 'In Progress'
  },
  isOnHomePage: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
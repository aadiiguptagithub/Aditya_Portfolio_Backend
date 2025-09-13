const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Admin'
  },
  category: {
    type: String,
    required: true,
    enum: ['Tutorial', 'CSS', 'JavaScript', 'React', 'Programming', 'Design', 'Technology']
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Scheduled'],
    default: 'Draft'
  },
  publishDate: {
    type: Date,
    default: null
  },
  scheduledDate: {
    type: Date,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number,
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  seo: {
    title: {
      type: String,
      maxlength: 60
    },
    description: {
      type: String,
      maxlength: 160
    },
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for better performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishDate: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ views: -1 });

module.exports = mongoose.model('Blog', blogSchema);
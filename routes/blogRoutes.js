const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  toggleFeatured,
  trackView,
  toggleLike,
  getBlogAnalytics
} = require('../controllers/blogController');

// Analytics routes (should be before parameterized routes)
router.get('/analytics', getBlogAnalytics);

// Blog CRUD routes
router.get('/', getBlogs);
router.post('/', createBlog);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Blog status and feature management
router.patch('/:id/status', updateBlogStatus);
router.patch('/:id/featured', toggleFeatured);

// Blog engagement routes
router.post('/:id/view', trackView);
router.post('/:id/like', toggleLike);

module.exports = router;
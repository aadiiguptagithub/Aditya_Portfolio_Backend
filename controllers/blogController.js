const Blog = require('../models/Blog');
const { generateSlug, calculateReadTime, generateExcerpt, generateSEO, ensureUniqueSlug } = require('../utils/blogUtils');

// Get all blogs with filtering, sorting, and pagination
const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      tags,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    if (featured !== undefined) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    // Get filter options
    const categories = await Blog.distinct('category');
    const allTags = await Blog.distinct('tags');

    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        categories,
        tags: allTags
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single blog by ID
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featuredImage, status, scheduledDate, seo, featured } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    // Generate slug
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(Blog, baseSlug);

    // Calculate reading time
    const readTime = calculateReadTime(content);

    // Generate excerpt if not provided
    const finalExcerpt = excerpt || generateExcerpt(content);

    // Set publish date if status is Published
    let publishDate = null;
    if (status === 'Published') {
      publishDate = new Date();
    } else if (status === 'Scheduled' && scheduledDate) {
      publishDate = new Date(scheduledDate);
    }

    const blog = new Blog({
      title,
      slug,
      excerpt: finalExcerpt,
      content,
      featuredImage: featuredImage || '',
      category,
      tags: tags || [],
      status: status || 'Draft',
      publishDate,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      featured: featured || false,
      readTime,
      seo: generateSEO({ title, excerpt: finalExcerpt, tags, seo })
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, tags, featuredImage, status, scheduledDate, seo, featured } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update slug if title changed
    let slug = blog.slug;
    if (title && title !== blog.title) {
      const baseSlug = generateSlug(title);
      slug = await ensureUniqueSlug(Blog, baseSlug, id);
    }

    // Calculate reading time if content changed
    let readTime = blog.readTime;
    if (content && content !== blog.content) {
      readTime = calculateReadTime(content);
    }

    // Generate excerpt if content changed and no excerpt provided
    let finalExcerpt = excerpt;
    if (content && content !== blog.content && !excerpt) {
      finalExcerpt = generateExcerpt(content);
    }

    // Handle publish date
    let publishDate = blog.publishDate;
    if (status === 'Published' && blog.status !== 'Published') {
      publishDate = new Date();
    } else if (status === 'Scheduled' && scheduledDate) {
      publishDate = new Date(scheduledDate);
    } else if (status === 'Draft') {
      publishDate = null;
    }

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (finalExcerpt) blog.excerpt = finalExcerpt;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (status) blog.status = status;
    if (scheduledDate !== undefined) blog.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    if (featured !== undefined) blog.featured = featured;
    
    blog.slug = slug;
    blog.readTime = readTime;
    blog.publishDate = publishDate;
    blog.seo = generateSEO({ title: blog.title, excerpt: blog.excerpt, tags: blog.tags, seo });

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update blog status
const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Draft', 'Published', 'Scheduled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Set publish date if changing to Published
    if (status === 'Published' && blog.status !== 'Published') {
      blog.publishDate = new Date();
    } else if (status === 'Draft') {
      blog.publishDate = null;
    }

    blog.status = status;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Toggle featured status
const toggleFeatured = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.featured = !blog.featured;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track blog view
const trackView = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.views += 1;
    await blog.save();

    res.json({ views: blog.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle like
const toggleLike = async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (action === 'like') {
      blog.likes += 1;
    } else if (action === 'unlike' && blog.likes > 0) {
      blog.likes -= 1;
    }

    await blog.save();
    res.json({ likes: blog.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get blog analytics
const getBlogAnalytics = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'Published' });
    const draftBlogs = await Blog.countDocuments({ status: 'Draft' });
    const featuredBlogs = await Blog.countDocuments({ featured: true });

    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ]);

    const topCategories = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const popularPosts = await Blog.find({ status: 'Published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title slug views likes');

    res.json({
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      featuredBlogs,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      topCategories,
      popularPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
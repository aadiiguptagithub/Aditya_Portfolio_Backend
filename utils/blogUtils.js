// Generate SEO-friendly slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Calculate reading time (avg 200 words/minute)
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Generate excerpt from content if not provided
const generateExcerpt = (content, maxLength = 300) => {
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
};

// Generate SEO fields if not provided
const generateSEO = (blog) => {
  return {
    title: blog.seo?.title || blog.title.substring(0, 60),
    description: blog.seo?.description || (blog.excerpt || generateExcerpt(blog.content, 160)),
    keywords: blog.seo?.keywords || blog.tags
  };
};

// Ensure unique slug
const ensureUniqueSlug = async (Blog, baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    
    const existingBlog = await Blog.findOne(query);
    if (!existingBlog) break;
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

module.exports = {
  generateSlug,
  calculateReadTime,
  generateExcerpt,
  generateSEO,
  ensureUniqueSlug
};
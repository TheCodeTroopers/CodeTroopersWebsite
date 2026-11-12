const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

exports.getAll = async (req, res) => {
  try {
    const data = await readJSON('blogs.json');
    const { status, category } = req.query;
    let blogs = data.blogs || [];

    // Filter by status if specified, otherwise return all
    if (status) {
      blogs = blogs.filter(b => b.status === status);
    }
    if (category) {
      blogs = blogs.filter(b => b.category?.toLowerCase() === category.toLowerCase());
    }

    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJSON('blogs.json');
    const blog = (data.blogs || []).find(b => b.id === id || b.slug === id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await readJSON('blogs.json');
    if (!data.blogs) data.blogs = [];

    const {
      title,
      slug,
      author,
      authorRole,
      date,
      readTime,
      category,
      coverImage,
      summary,
      content,
      tags,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newBlog = {
      id: `blog-${uuidv4().slice(0, 8)}`,
      title,
      slug: slug || slugify(title),
      author: author || 'CodeTroopers Editorial',
      authorRole: authorRole || 'Contributor',
      date: date || new Date().toISOString().split('T')[0],
      readTime: readTime || '4 min read',
      category: category || 'Engineering',
      coverImage: coverImage || '/uploads/technical-talks/cover.jpg',
      summary: summary || '',
      content: content || '',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: status || 'published',
      likes: 0
    };

    data.blogs.unshift(newBlog);
    await writeJSON('blogs.json', data);
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJSON('blogs.json');
    const index = (data.blogs || []).findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const current = data.blogs[index];
    const tags = req.body.tags;
    const processedTags = tags !== undefined
      ? (Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : current.tags)
      : current.tags;

    data.blogs[index] = {
      ...current,
      ...req.body,
      tags: processedTags,
      id // preserve id
    };

    await writeJSON('blogs.json', data);
    res.json(data.blogs[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJSON('blogs.json');
    const index = (data.blogs || []).findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const removed = data.blogs.splice(index, 1)[0];
    await writeJSON('blogs.json', data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

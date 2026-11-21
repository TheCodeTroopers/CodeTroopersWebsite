const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function parseTags(tags, fallback = []) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
  return fallback;
}

const isAdmin = (req) => Boolean(req.user && req.user.role === 'admin');

exports.getAll = async (req, res) => {
  try {
    const { status, category } = req.query;
    let blogs = await store.blogs.list();

    // Public visitors only ever see published posts. Admins (valid token) see everything.
    if (!isAdmin(req)) {
      blogs = blogs.filter(b => (b.status || 'published') === 'published');
    } else if (status) {
      blogs = blogs.filter(b => b.status === status);
    }
    if (category) {
      blogs = blogs.filter(b => b.category?.toLowerCase() === category.toLowerCase());
    }

    res.json({ blogs });
  } catch (err) {
    fail(res, err);
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = await store.blogs.get(id);
    if (!blog) {
      // Posts can also be addressed by slug.
      blog = (await store.blogs.list()).find(b => b.slug === id) || null;
    }

    if (!blog || (!isAdmin(req) && (blog.status || 'published') !== 'published')) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (err) {
    fail(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const {
      title, slug, author, authorRole, date, readTime, category,
      coverImage, summary, content, tags, status
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const blog = await store.blogs.insert({
      id: `blog-${uuidv4().slice(0, 8)}`,
      title,
      slug: slug || slugify(title),
      author: author || 'CodeTroopers Editorial',
      authorRole: authorRole || 'Contributor',
      date: date || new Date().toISOString().split('T')[0],
      readTime: readTime || '4 min read',
      category: category || 'Engineering',
      coverImage: coverImage || '/images/default-cover.jpg',
      summary: summary || '',
      content: content || '',
      tags: parseTags(tags),
      status: status || 'published',
      likes: 0
    });

    res.status(201).json(blog);
  } catch (err) {
    fail(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await store.blogs.get(id);
    if (!current) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const patch = { ...req.body };
    if (patch.tags !== undefined) patch.tags = parseTags(patch.tags, current.tags);

    res.json(await store.blogs.update(id, patch));
  } catch (err) {
    fail(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const removed = await store.blogs.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(removed);
  } catch (err) {
    fail(res, err);
  }
};

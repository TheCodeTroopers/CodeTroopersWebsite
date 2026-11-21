const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

exports.getAll = async (req, res) => {
  try {
    res.json({ items: await store.gallery.list() });
  } catch (err) {
    fail(res, err);
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await store.gallery.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    fail(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const item = await store.gallery.insert({
      id: req.body.id || `gal-${uuidv4().slice(0, 8)}`,
      title: req.body.title || 'Untitled Collection',
      category: req.body.category || 'workshops',
      cover: req.body.cover || '',
      images: Array.isArray(req.body.images) ? req.body.images : []
    });
    res.status(201).json(item);
  } catch (err) {
    fail(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const item = await store.gallery.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    fail(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const removed = await store.gallery.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Item not found' });
    res.json(removed);
  } catch (err) {
    fail(res, err);
  }
};

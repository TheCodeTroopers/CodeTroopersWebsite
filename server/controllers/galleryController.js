const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
  try {
    const data = await readJSON('gallery.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await readJSON('gallery.json');
    const item = data.items.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await readJSON('gallery.json');
    const item = {
      id: req.body.id || `gal-${uuidv4().slice(0, 8)}`,
      title: req.body.title || 'Untitled Collection',
      category: req.body.category || 'workshops',
      cover: req.body.cover || '',
      images: Array.isArray(req.body.images) ? req.body.images : []
    };
    data.items.unshift(item);
    await writeJSON('gallery.json', data);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await readJSON('gallery.json');
    const index = data.items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });

    data.items[index] = {
      ...data.items[index],
      ...req.body,
      id: req.params.id
    };

    await writeJSON('gallery.json', data);
    res.json(data.items[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await readJSON('gallery.json');
    const index = data.items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });
    const removed = data.items.splice(index, 1)[0];
    await writeJSON('gallery.json', data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

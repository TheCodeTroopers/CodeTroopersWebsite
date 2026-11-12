const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
  try {
    const data = await readJSON('achievements.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await readJSON('achievements.json');
    const item = data.items.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Achievement not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await readJSON('achievements.json');
    const item = { id: uuidv4(), ...req.body };
    data.items.unshift(item);
    await writeJSON('achievements.json', data);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await readJSON('achievements.json');
    const index = data.items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Achievement not found' });
    data.items[index] = { ...data.items[index], ...req.body, id: req.params.id };
    await writeJSON('achievements.json', data);
    res.json(data.items[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await readJSON('achievements.json');
    const index = data.items.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Achievement not found' });
    const removed = data.items.splice(index, 1)[0];
    await writeJSON('achievements.json', data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

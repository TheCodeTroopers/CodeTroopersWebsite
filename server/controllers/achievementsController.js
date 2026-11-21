const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

exports.getAll = async (req, res) => {
  try {
    res.json({ items: await store.achievements.list() });
  } catch (err) {
    fail(res, err);
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await store.achievements.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Achievement not found' });
    res.json(item);
  } catch (err) {
    fail(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const item = await store.achievements.insert({ ...req.body, id: uuidv4() });
    res.status(201).json(item);
  } catch (err) {
    fail(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const item = await store.achievements.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Achievement not found' });
    res.json(item);
  } catch (err) {
    fail(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const removed = await store.achievements.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Achievement not found' });
    res.json(removed);
  } catch (err) {
    fail(res, err);
  }
};

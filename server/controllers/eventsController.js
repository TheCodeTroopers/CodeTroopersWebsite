const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

exports.getAll = async (req, res) => {
  try {
    let events = await store.events.list();
    const { type } = req.query;
    if (type) events = events.filter(e => e.type === type);
    res.json({ events });
  } catch (err) {
    fail(res, err);
  }
};

exports.getById = async (req, res) => {
  try {
    const event = await store.events.get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    fail(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const event = await store.events.insert({ ...req.body, id: uuidv4() });
    res.status(201).json(event);
  } catch (err) {
    fail(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const event = await store.events.update(req.params.id, req.body);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    fail(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const removed = await store.events.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Event not found' });
    res.json(removed);
  } catch (err) {
    fail(res, err);
  }
};

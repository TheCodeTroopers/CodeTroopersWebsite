const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
  try {
    const data = await readJSON('events.json');
    const { type } = req.query;
    if (type) {
      return res.json({ events: data.events.filter(e => e.type === type) });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await readJSON('events.json');
    const event = { id: uuidv4(), ...req.body };
    data.events.push(event);
    await writeJSON('events.json', data);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await readJSON('events.json');
    const index = data.events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Event not found' });
    data.events[index] = { ...data.events[index], ...req.body, id: req.params.id };
    await writeJSON('events.json', data);
    res.json(data.events[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await readJSON('events.json');
    const index = data.events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Event not found' });
    const removed = data.events.splice(index, 1)[0];
    await writeJSON('events.json', data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

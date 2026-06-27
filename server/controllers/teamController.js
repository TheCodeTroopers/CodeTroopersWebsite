const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
  try {
    const data = await readJSON('team.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await readJSON('team.json');
    const member = { id: uuidv4(), ...req.body };
    data.members.push(member);
    await writeJSON('team.json', data);
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await readJSON('team.json');
    const index = data.members.findIndex(m => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Member not found' });
    data.members[index] = { ...data.members[index], ...req.body, id: req.params.id };
    await writeJSON('team.json', data);
    res.json(data.members[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await readJSON('team.json');
    const index = data.members.findIndex(m => m.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Member not found' });
    const removed = data.members.splice(index, 1)[0];
    await writeJSON('team.json', data);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

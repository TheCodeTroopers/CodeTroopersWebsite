const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

exports.getAll = async (req, res) => {
  try {
    res.json({ members: await store.team.list() });
  } catch (err) {
    fail(res, err);
  }
};

exports.getById = async (req, res) => {
  try {
    const member = await store.team.get(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    fail(res, err);
  }
};

exports.create = async (req, res) => {
  try {
    const member = await store.team.insert({ ...req.body, id: uuidv4() });
    res.status(201).json(member);
  } catch (err) {
    fail(res, err);
  }
};

exports.update = async (req, res) => {
  try {
    const member = await store.team.update(req.params.id, req.body);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    fail(res, err);
  }
};

exports.remove = async (req, res) => {
  try {
    const removed = await store.team.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Member not found' });
    res.json(removed);
  } catch (err) {
    fail(res, err);
  }
};

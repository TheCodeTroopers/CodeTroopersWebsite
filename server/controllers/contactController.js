const { v4: uuidv4 } = require('uuid');
const store = require('../utils/store');
const { fail } = require('../utils/respond');

const INFO_ID = 'main';

async function loadInfoDoc() {
  const doc = await store.contactInfo.get(INFO_ID);
  return doc || { id: INFO_ID, info: {}, faq: [] };
}

exports.getInfo = async (req, res) => {
  try {
    const doc = await loadInfoDoc();
    res.json({ info: doc.info, faq: doc.faq });
  } catch (err) {
    fail(res, err);
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const doc = await loadInfoDoc();
    const next = {
      id: INFO_ID,
      info: req.body.info ? { ...doc.info, ...req.body.info } : doc.info,
      faq: req.body.faq ? req.body.faq : doc.faq
    };
    const saved = await store.contactInfo.upsert(next);
    res.json({ info: saved.info, faq: saved.faq });
  } catch (err) {
    fail(res, err);
  }
};

const clip = (value, max) => String(value ?? '').trim().slice(0, max);

exports.submit = async (req, res) => {
  try {
    const name = clip(req.body.name, 120);
    const email = clip(req.body.email, 200);
    const message = clip(req.body.message, 5000);

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Only store known fields; never spread arbitrary request bodies into the database.
    const submission = await store.contactSubmissions.insert({
      id: uuidv4(),
      name,
      email,
      subject: clip(req.body.subject, 200),
      message,
      submittedAt: new Date().toISOString()
    });
    res.status(201).json({ message: 'Message sent successfully', submission });
  } catch (err) {
    fail(res, err);
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    res.json({ submissions: await store.contactSubmissions.list() });
  } catch (err) {
    fail(res, err);
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const removed = await store.contactSubmissions.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json({ message: 'Submission deleted', removed });
  } catch (err) {
    fail(res, err);
  }
};

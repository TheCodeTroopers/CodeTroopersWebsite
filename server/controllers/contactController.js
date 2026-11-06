const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

exports.getInfo = async (req, res) => {
  try {
    const data = await readJSON('contact.json');
    res.json({ info: data.info, faq: data.faq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const data = await readJSON('contact.json');
    if (req.body.info) {
      data.info = { ...data.info, ...req.body.info };
    }
    if (req.body.faq) {
      data.faq = req.body.faq;
    }
    await writeJSON('contact.json', data);
    res.json({ info: data.info, faq: data.faq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submit = async (req, res) => {
  try {
    const data = await readJSON('contact.json');
    const submission = {
      id: uuidv4(),
      ...req.body,
      submittedAt: new Date().toISOString()
    };
    if (!data.submissions) data.submissions = [];
    data.submissions.unshift(submission);
    await writeJSON('contact.json', data);
    res.status(201).json({ message: 'Message sent successfully', submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const data = await readJSON('contact.json');
    res.json({ submissions: data.submissions || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJSON('contact.json');
    if (!data.submissions) data.submissions = [];
    const index = data.submissions.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    const removed = data.submissions.splice(index, 1)[0];
    await writeJSON('contact.json', data);
    res.json({ message: 'Submission deleted', removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

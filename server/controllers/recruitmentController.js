const { readJSON, writeJSON } = require('../utils/jsonStore');
const { v4: uuidv4 } = require('uuid');

/**
 * Recruitment & Join Us Applications Controller
 *
 * NOTE FOR BACKEND COLLABORATOR:
 * This controller serves the admin recruitment management interface.
 * Currently backed by JSON store fallback, ready to be connected to Supabase
 * for applicant metadata and Google Drive for resume links.
 * All endpoints below are protected with `requireAdmin` middleware.
 */

// GET /api/recruitment/applications (or /api/applications)
exports.getAll = async (req, res) => {
  try {
    const raw = await readJSON('applications.json');
    let applications = Array.isArray(raw) ? [...raw] : (raw.applications ? [...raw.applications] : []);

    const { status, domain, search } = req.query;

    if (status && status !== 'all') {
      applications = applications.filter(a => a.status?.toLowerCase() === status.toLowerCase());
    }

    if (domain && domain !== 'all') {
      applications = applications.filter(a => {
        if (Array.isArray(a.domains)) {
          return a.domains.some(d => d.toLowerCase().includes(domain.toLowerCase()));
        }
        return typeof a.domain === 'string' && a.domain.toLowerCase().includes(domain.toLowerCase());
      });
    }

    if (search) {
      const q = search.toLowerCase();
      applications = applications.filter(a => 
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.fullName && a.fullName.toLowerCase().includes(q)) ||
        (a.full_name && a.full_name.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q)) ||
        (a.collegeEmail && a.collegeEmail.toLowerCase().includes(q)) ||
        (a.college_email && a.college_email.toLowerCase().includes(q)) ||
        (a.usn && a.usn.toLowerCase().includes(q)) ||
        (a.branch && a.branch.toLowerCase().includes(q)) ||
        (a.skills && a.skills.toLowerCase().includes(q)) ||
        (a.skillsExperience && a.skillsExperience.toLowerCase().includes(q))
      );
    }

    // Sort by most recent application first
    applications.sort((a, b) => new Date(b.appliedAt || b.created_at || b.createdAt || 0) - new Date(a.appliedAt || a.created_at || a.createdAt || 0));

    res.json({ applications, total: applications.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/recruitment/applications/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const raw = await readJSON('applications.json');
    const applications = Array.isArray(raw) ? raw : (raw.applications || []);
    const application = applications.find(a => a.id === id || a._id === id || a.application_id === id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/recruitment/applications/:id/status
// or PUT /api/recruitment/applications/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const raw = await readJSON('applications.json');
    const isRawArray = Array.isArray(raw);
    const applications = isRawArray ? [...raw] : (raw.applications ? [...raw.applications] : []);

    const index = applications.findIndex(a => a.id === id || a._id === id || a.application_id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    applications[index].status = status.toLowerCase();
    applications[index].updatedAt = new Date().toISOString();

    if (isRawArray) {
      await writeJSON('applications.json', applications);
    } else {
      raw.applications = applications;
      await writeJSON('applications.json', raw);
    }

    res.json({
      message: `Application status updated to ${status}`,
      application: applications[index]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/recruitment/applications/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const raw = await readJSON('applications.json');
    const isRawArray = Array.isArray(raw);
    const applications = isRawArray ? [...raw] : (raw.applications ? [...raw.applications] : []);

    const index = applications.findIndex(a => a.id === id || a._id === id || a.application_id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const removed = applications.splice(index, 1)[0];
    if (isRawArray) {
      await writeJSON('applications.json', applications);
    } else {
      raw.applications = applications;
      await writeJSON('applications.json', raw);
    }

    res.json({ message: 'Application removed successfully', removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/recruitment/stats
exports.getStats = async (req, res) => {
  try {
    const raw = await readJSON('applications.json');
    const apps = Array.isArray(raw) ? raw : (raw.applications || []);

    const stats = {
      total: apps.length,
      pending: apps.filter(a => (a.status || 'pending').toLowerCase() === 'pending').length,
      reviewing: apps.filter(a => a.status?.toLowerCase() === 'reviewing').length,
      shortlisted: apps.filter(a => a.status?.toLowerCase() === 'shortlisted').length,
      accepted: apps.filter(a => a.status?.toLowerCase() === 'accepted').length,
      rejected: apps.filter(a => a.status?.toLowerCase() === 'rejected').length
    };

    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


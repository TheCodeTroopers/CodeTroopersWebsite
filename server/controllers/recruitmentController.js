const {
  fetchAllApplications,
  fetchApplicationById,
  updateApplicationStatus,
  deleteApplication,
  calculateStats,
  isSupabaseConfigured
} = require('../utils/supabase');

/**
 * Recruitment & Join Us Applications Controller
 *
 * Backed by Supabase with seamless JSON storage fallback.
 * Protected with `requireAdmin` JWT authentication middleware.
 */

// GET /api/recruitment/applications (or /api/applications)
exports.getAll = async (req, res) => {
  try {
    const { status, domain, search } = req.query;
    const applications = await fetchAllApplications({ status, domain, search });

    res.json({
      applications,
      total: applications.length,
      storage: isSupabaseConfigured() ? 'supabase' : 'json'
    });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch applications' });
  }
};

// GET /api/recruitment/applications/:id (or /api/applications/:id)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await fetchApplicationById(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    console.error('Error fetching application by ID:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch application' });
  }
};

// PATCH or PUT /api/recruitment/applications/:id/status
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

    const updated = await updateApplicationStatus(id, status);

    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      message: `Application status updated to ${status}`,
      application: updated
    });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: err.message || 'Failed to update application status' });
  }
};

// DELETE /api/recruitment/applications/:id (or /api/applications/:id)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await deleteApplication(id);

    if (!removed) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      message: 'Application removed successfully',
      removed
    });
  } catch (err) {
    console.error('Error removing application:', err);
    res.status(500).json({ error: err.message || 'Failed to delete application' });
  }
};

// GET /api/recruitment/stats
exports.getStats = async (req, res) => {
  try {
    const stats = await calculateStats();
    res.json({ stats });
  } catch (err) {
    console.error('Error getting recruitment stats:', err);
    res.status(500).json({ error: err.message || 'Failed to compute recruitment stats' });
  }
};

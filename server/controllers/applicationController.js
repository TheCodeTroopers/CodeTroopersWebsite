const { uploadFileToDrive } = require('../utils/googleDrive');
const { saveApplication, isSupabaseConfigured } = require('../utils/supabase');

exports.submit = async (req, res) => {
  try {
    const {
      fullName,
      usn,
      semester,
      collegeEmail,
      phone,
      skillsExperience,
      github,
      linkedin,
      motivation
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Resume PDF file is required.' });
    }

    if (!fullName || !collegeEmail) {
      return res.status(400).json({ error: 'Full name and college email are required.' });
    }

    // Clean name for Drive filename
    const cleanName = (fullName || 'Applicant').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanUsn = (usn || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const driveFileName = `${cleanName}${cleanUsn ? `_${cleanUsn}` : ''}_Resume_${Date.now()}.pdf`;

    // Upload directly to Google Drive (supports Service Account and OAuth)
    const driveFile = await uploadFileToDrive({
      buffer: req.file.buffer,
      filename: driveFileName,
      mimeType: req.file.mimetype || 'application/pdf'
    });

    // Save record to Supabase (with JSON fallback)
    const { application, savedInSupabase } = await saveApplication(
      {
        fullName,
        usn,
        semester,
        collegeEmail,
        phone,
        skillsExperience,
        github,
        linkedin,
        motivation
      },
      driveFile,
      req.file
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Your resume has been uploaded to Google Drive.',
      applicationId: application.id,
      storage: savedInSupabase ? 'supabase' : 'json'
    });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({
      error: err.message || 'Failed to submit application. Please try again.'
    });
  }
};

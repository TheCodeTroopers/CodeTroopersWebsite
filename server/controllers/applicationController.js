const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/jsonStore');
const { uploadFileToDrive } = require('../utils/googleDrive');

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

    // Upload directly to Google Drive
    const driveFile = await uploadFileToDrive({
      buffer: req.file.buffer,
      filename: driveFileName,
      mimeType: req.file.mimetype || 'application/pdf'
    });

    const applicationRecord = {
      id: uuidv4(),
      fullName,
      usn,
      semester,
      collegeEmail,
      phone,
      skillsExperience,
      github,
      linkedin,
      motivation,
      resume: {
        fileName: driveFile.name,
        driveFileId: driveFile.id,
        driveViewLink: driveFile.webViewLink,
        originalName: req.file.originalname,
        size: req.file.size
      },
      submittedAt: new Date().toISOString()
    };

    // Save record to applications.json (best-effort, handles read-only filesystems on Vercel)
    try {
      let applications = [];
      try {
        applications = await readJSON('applications.json');
        if (!Array.isArray(applications)) applications = [];
      } catch {
        applications = [];
      }

      applications.push(applicationRecord);
      await writeJSON('applications.json', applications);
    } catch (fsErr) {
      console.warn('Local JSON write skipped (typical in serverless/Vercel):', fsErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Your resume has been received.',
      applicationId: applicationRecord.id
    });
  } catch (err) {
    console.error('Application submission error:', err);
    res.status(500).json({
      error: err.message || 'Failed to submit application. Please try again.'
    });
  }
};


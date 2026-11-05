const { google } = require('googleapis');
const { Readable } = require('stream');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1SaE3GfrbakynHunyvQsX1lTzgKEOaNe2';

let driveClient = null;

function getDriveClient() {
  if (driveClient) return driveClient;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Google OAuth credentials missing! Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN are set in .env');
  }

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });

  driveClient = google.drive({ version: 'v3', auth: oauth2Client });
  return driveClient;
}

/**
 * Uploads a file buffer to the designated Google Drive folder
 * @param {Object} options
 * @param {Buffer} options.buffer - File buffer
 * @param {string} options.filename - Name of the file in Drive
 * @param {string} [options.mimeType] - MIME type of the file
 * @returns {Promise<Object>} Created file metadata { id, name, webViewLink, webContentLink }
 */
async function uploadFileToDrive({ buffer, filename, mimeType }) {
  const drive = getDriveClient();

  const fileMetadata = {
    name: filename,
    parents: [FOLDER_ID]
  };

  const media = {
    mimeType: mimeType || 'application/pdf',
    body: Readable.from(buffer)
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink',
    supportsAllDrives: true
  });

  return response.data;
}

module.exports = {
  uploadFileToDrive,
  FOLDER_ID
};

// googleapis is huge (about 1 s to load). Load it only when a resume upload really needs it, so every
// other API request (and every cold start) stays fast.
const getGoogle = () => require('googleapis').google;
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1SaE3GfrbakynHunyvQsX1lTzgKEOaNe2';

let driveClient = null;

function getServiceAccountCredentials() {
  const rawValue = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const trimmedValue = typeof rawValue === 'string' ? rawValue.trim() : '';
  const diagnostics = {
    exists: Boolean(rawValue),
    length: typeof rawValue === 'string' ? rawValue.length : 0,
    startsWithBrace: trimmedValue.startsWith('{'),
    endsWithBrace: trimmedValue.endsWith('}'),
    jsonParseSuccess: false
  };

  if (!trimmedValue) {
    return null;
  }

  try {
    let credentials = JSON.parse(trimmedValue);

    // Accept values copied from a dashboard as a JSON-encoded string.
    if (typeof credentials === 'string') {
      credentials = JSON.parse(credentials);
    }

    if (!credentials || typeof credentials !== 'object' || Array.isArray(credentials)) {
      throw new Error('service account value is not a JSON object');
    }

    diagnostics.jsonParseSuccess = true;
    return credentials;
  } catch (err) {
    console.warn('[Google Drive] Service account JSON parse failed:', err.message);
    return null;
  }
}

/**
 * Initializes and returns the Google Drive client.
 * Supports BOTH OAuth2 credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
 * AND Google Service Account credentials.
 * OAuth2 is prioritized to avoid personal Drive 0-quota errors with Service Accounts.
 */
function getDriveClient() {
  if (driveClient) return driveClient;

  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive'
  ];

  // 1. Check for OAuth2 credentials FIRST (Required for personal Google Drive to avoid Service Account 0-quota errors)
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

  if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
    try {
      const oauth2Client = new (getGoogle().auth.OAuth2)(
        CLIENT_ID,
        CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );

      oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
      });

      driveClient = getGoogle().drive({ version: 'v3', auth: oauth2Client });
      return driveClient;
    } catch (err) {
      console.warn('Failed to initialize Google OAuth2 client:', err.message);
    }
  }

  // 2. Check for Service Account JSON string in environment variable (Vercel standard)
  const credentials = getServiceAccountCredentials();
  if (credentials) {
    try {
      const auth = new (getGoogle().auth.GoogleAuth)({
        credentials,
        scopes
      });

      driveClient = getGoogle().drive({ version: 'v3', auth });
      return driveClient;
    } catch (err) {
      console.warn('Failed to initialize Google service account auth:', err.message);
    }
  }

  // 3. Check for individual Service Account email & private key in environment variables
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  const saKey = process.env.GOOGLE_PRIVATE_KEY;
  if (saEmail && saKey) {
    try {
      const formattedKey = saKey.replace(/\\n/g, '\n');
      const auth = new (getGoogle().auth.JWT)(
        saEmail,
        null,
        formattedKey,
        scopes
      );

      driveClient = getGoogle().drive({ version: 'v3', auth });
      return driveClient;
    } catch (err) {
      console.warn('Failed to initialize Service Account JWT auth:', err.message);
    }
  }

  // 4. Check for local or designated Service Account JSON file path
  const localCredFile = path.join(__dirname, '..', 'google-credentials.json');
  const appCredsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const targetKeyFile = (appCredsPath && fs.existsSync(appCredsPath)) 
    ? appCredsPath 
    : (fs.existsSync(localCredFile) ? localCredFile : null);

  if (targetKeyFile) {
    try {
      const auth = new (getGoogle().auth.GoogleAuth)({
        keyFile: targetKeyFile,
        scopes
      });

      driveClient = getGoogle().drive({ version: 'v3', auth });
      return driveClient;
    } catch (err) {
      console.warn(`Failed to initialize GoogleAuth from ${targetKeyFile}:`, err.message);
    }
  }

  throw new Error(
    'Google Drive credentials missing! Configure either:\n' +
    '1) OAuth2: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN\n' +
    '2) Service Account: GOOGLE_SERVICE_ACCOUNT_JSON (or GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY, or server/google-credentials.json)'
  );
}

/**
 * Uploads a file buffer to the designated Google Drive folder and ensures viewable permissions
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

  const fileData = response.data;

  // Set file permissions to 'anyone with link can view' so recruiters/admins can open the resume link
  try {
    await drive.permissions.create({
      fileId: fileData.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      },
      supportsAllDrives: true
    });
  } catch (permErr) {
    // Non-fatal if organization policy or domain restricts public links
    console.warn('Note: Could not set public reader permission on resume file:', permErr.message);
  }

  // Guarantee webViewLink is present
  if (!fileData.webViewLink && fileData.id) {
    fileData.webViewLink = `https://drive.google.com/file/d/${fileData.id}/view?usp=sharing`;
  }

  return fileData;
}

module.exports = {
  getDriveClient,
  uploadFileToDrive,
  FOLDER_ID
};

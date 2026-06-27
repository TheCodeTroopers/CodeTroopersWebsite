const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

async function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

async function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}

module.exports = { readJSON, writeJSON };

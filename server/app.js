const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const teamRoutes = require('./routes/teamRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const achievementsRoutes = require('./routes/achievementsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contactController = require('./controllers/contactController');
const authRoutes = require('./routes/authRoutes');
const blogsRoutes = require('./routes/blogsRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { requireAdmin } = require('./utils/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/applications', recruitmentRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.get('/api/contact-info', contactController.getInfo);
app.put('/api/contact-info', requireAdmin, contactController.updateInfo);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Code Troopers API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Code Troopers server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Use a different PORT or stop the process using it.`);
      process.exit(1);
    }
    console.error('Server error:', err);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;

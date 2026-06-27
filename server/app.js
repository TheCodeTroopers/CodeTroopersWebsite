const express = require('express');
const cors = require('cors');
const path = require('path');

const teamRoutes = require('./routes/teamRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const achievementsRoutes = require('./routes/achievementsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contactController = require('./controllers/contactController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/team', teamRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/contact', contactRoutes);
app.get('/api/testimonials', contactController.getTestimonials);
app.get('/api/contact-info', contactController.getInfo);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Code Troopers API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

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

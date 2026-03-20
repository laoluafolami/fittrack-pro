const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./src/config/database');
const authRoutes      = require('./src/routes/authRoutes');
const memberRoutes    = require('./src/routes/memberRoutes');
const classRoutes     = require('./src/routes/classRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['https://fittrack-app.azurewebsites.net', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/members',   memberRoutes);
app.use('/api/classes',   classRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🏋️ FitTrack Pro API is running!', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 FitTrack Pro API running on port ${PORT}`);
  });
});
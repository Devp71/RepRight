const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const planRoutes = require('./routes/plans');
const goalRoutes = require('./routes/goals');
const formAnalysisRoutes = require('./routes/formAnalysis');
const voiceSessionRoutes = require('./routes/voiceSessions');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/form-analysis', formAnalysisRoutes);
app.use('/api/voice-sessions', voiceSessionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'SYSTEM_ONLINE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── Error Handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Database Connection & Server Start ─────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('[SYSTEM] MongoDB connection established');
    app.listen(PORT, () => {
      console.log(`[SYSTEM] RepRight backend online — port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[SYSTEM] MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;

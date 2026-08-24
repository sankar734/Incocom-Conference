const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/database');
// Load models so Sequelize registers them before sync
require('./models/Admin');
require('./models/Registration');

const app = express();

// CORS configuration: Allow localhost, configured FRONTEND_URL(s), or all in permissive mode
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(url => {
    const trimmed = url.trim().replace(/\/$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    // Allow any vercel.app or netlify.app preview deployment
    if (origin.endsWith('.vercel.app') || origin.endsWith('.netlify.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback to ensure hosting works seamlessly
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/registration', require('./routes/registrationRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));
app.use('/api/payment',      require('./routes/paymentRoutes'));

app.get('/api/health', (req, res) =>
  res.json({
    status: 'OK',
    message: 'INCOCOM 2K26 API running (MySQL)',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  })
);

// Serve frontend build if exists (for Fullstack production hosting)
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message || err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Maximum size is 15 MB.' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Start server when run directly
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀  Backend  → http://localhost:${PORT}`);
        console.log(`🔑  Admin    → ${process.env.ADMIN_EMAIL || 'mbamcaadmin@nprcet.org'} / ${process.env.ADMIN_PASSWORD || 'Incocom@2026'}`);
      });
    })
    .catch(err => {
      console.error('⚠️   Server starting with DB warnings. Check database configuration in .env');
      app.listen(PORT, () => {
        console.log(`🚀  Backend started (Offline DB mode) → http://localhost:${PORT}`);
      });
    });
}

module.exports = app;

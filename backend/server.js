const express  = require('express');
const cors     = require('cors');
const path     = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
// Load models so Sequelize registers them before sync
require('./models/Admin');
require('./models/Registration');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/registration', require('./routes/registrationRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));
app.use('/api/payment',      require('./routes/paymentRoutes'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'INCOCOM 2K26 API running (MySQL)', time: new Date().toISOString() })
);

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large.' });
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀  Backend  → http://localhost:${PORT}`);
      console.log(`🔑  Admin    → ${process.env.ADMIN_EMAIL || 'admin@nprcet.edu.in'} / ${process.env.ADMIN_PASSWORD || 'Admin@2026'}`);
    });
  })
  .catch(err => { console.error('❌  DB Error:', err.message); process.exit(1); });

module.exports = app;

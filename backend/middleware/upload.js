const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const uploadDir     = path.join(__dirname, '..', 'uploads', 'papers');
const screenshotDir = path.join(__dirname, '..', 'uploads', 'screenshots');

[uploadDir, screenshotDir].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ── Paper file storage ───────────────────────────────────────────────────────
const paperStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const safe   = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + '-' + safe);
  },
});

const paperFilter = (req, file, cb) => {
  const allowed = ['.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only .doc and .docx files are allowed.'), false);
};

exports.uploadPaper = multer({
  storage:    paperStorage,
  fileFilter: paperFilter,
  limits:     { fileSize: 15 * 1024 * 1024 },
}).single('paperFile');

// ── Payment screenshot storage ────────────────────────────────────────────────
const screenshotStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, screenshotDir),
  filename:    (req, file, cb) => {
    const safe   = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, 'payment-' + unique + '-' + safe);
  },
});

const screenshotFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Screenshot must be JPG, PNG, or PDF.'), false);
};

exports.uploadScreenshot = multer({
  storage:    screenshotStorage,
  fileFilter: screenshotFilter,
  limits:     { fileSize: 10 * 1024 * 1024 },
}).single('screenshotFile');

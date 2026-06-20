const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    // ── ENV-BASED ADMIN (id === 'env-admin') ──────────────────────────────
    // When the admin logs in with the credentials defined in .env,
    // we create a synthetic token with id='env-admin'. No DB lookup needed.
    if (decoded.id === 'env-admin') {
      req.admin = {
        _id: 'env-admin',
        email: decoded.email || process.env.ADMIN_EMAIL || 'admin@nprcet.edu.in',
        name: 'Conference Admin',
        role: 'admin',
      };
      return next();
    }

    // ── DB-BASED ADMIN ─────────────────────────────────────────────────────
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin account not found.' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ success: false, message: 'Token invalid or expired. Please log in again.' });
  }
};

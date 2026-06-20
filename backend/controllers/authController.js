const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const envEmail = process.env.ADMIN_EMAIL || 'admin@nprcet.edu.in';
    const envPass  = process.env.ADMIN_PASSWORD || 'Admin@2026';

    if (email === envEmail && password === envPass) {
      const token = jwt.sign({ id: 'env-admin', email, role: 'admin' }, SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, admin: { email, name: 'Conference Admin', role: 'admin' } });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = jwt.sign({ id: admin.id }, SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, admin: { email: admin.email, name: admin.name, role: admin.role } });
  } catch (err) {
    console.error('adminLogin error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.verifyToken = async (req, res) => {
  res.json({ success: true, message: 'Token is valid.', admin: req.admin });
};

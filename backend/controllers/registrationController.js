const { Op } = require('sequelize');
const crypto = require('crypto');
const Registration = require('../models/Registration');
const { sendConfirmationEmail } = require('../utils/emailService');

const FEE_MAP = {
  'Foreigners & NRI':                     { amount: 940,  display: '$10 / ₹940' },
  'Academicians and Corporate Delegates': { amount: 1000, display: 'Rs.1000/-' },
  'Research Scholars and PG Students':    { amount: 500,  display: 'Rs.500/-' },
  'NPR Staff':                            { amount: 500,  display: 'Rs.500/-' },
  'NPR Students':                         { amount: 300,  display: 'Rs.300/-' },
};

exports.getFeeMap = () => FEE_MAP;

// ── In-memory pending registrations store ─────────────────────────────────────
// Data is held here temporarily until payment is submitted.
// Entries expire after 30 minutes if no payment is made.
const pendingStore = new Map(); // tempId → { data, expiresAt }
const PENDING_TTL_MS = 30 * 60 * 1000; // 30 minutes

function cleanExpired() {
  const now = Date.now();
  for (const [key, val] of pendingStore) {
    if (val.expiresAt < now) pendingStore.delete(key);
  }
}

function generateTempId() {
  return 'TEMP-' + crypto.randomBytes(8).toString('hex').toUpperCase();
}

// Public helper so paymentController can access pending store
exports.pendingStore = pendingStore;

exports.submitRegistration = async (req, res) => {
  try {
    cleanExpired();
    const body = req.body;

    const required = ['salutation','firstName','lastName','designation','department',
                      'collegeName','collegeAddress','district','phone','email',
                      'category','paperTitle','subTheme','abstract'];
    for (const f of required) {
      if (!body[f] || !String(body[f]).trim())
        return res.status(400).json({ success: false, message: `Field "${f}" is required.` });
    }

    if (!FEE_MAP[body.category])
      return res.status(400).json({ success: false, message: 'Invalid registration category.' });

    let coAuthors = [];
    if (body.coAuthors) {
      try { coAuthors = JSON.parse(body.coAuthors); } catch { coAuthors = []; }
    }
    if (coAuthors.length > 2)
      return res.status(400).json({ success: false, message: 'Maximum 2 co-authors allowed.' });

    // Check for duplicate in already-saved registrations
    const exists = await Registration.findOne({
      where: { email: body.email.toLowerCase().trim(), paperTitle: body.paperTitle.trim() }
    });
    if (exists)
      return res.status(400).json({
        success: false,
        message: 'A submission with this email and paper title already exists.',
        existingId: exists.registrationId,
      });

    // Build registration data — store in memory only, NOT saved to DB yet
    const tempId = generateTempId();
    const pendingData = {
      salutation:  body.salutation,
      firstName:   body.firstName.trim(),
      lastName:    body.lastName.trim(),
      designation: body.designation.trim(),
      department:  body.department.trim(),
      collegeName:    body.collegeName.trim(),
      collegeAddress: body.collegeAddress.trim(),
      district:       body.district.trim(),
      phone:       body.phone.trim(),
      email:       body.email.toLowerCase().trim(),
      category:    body.category,
      coAuthors,
      paperTitle:  body.paperTitle.trim(),
      subTheme:    body.subTheme,
      keywords:    (body.keywords || '').trim(),
      abstract:    body.abstract.trim(),
    };

    if (req.file) {
      pendingData.paperFilename     = req.file.filename;
      pendingData.paperOriginalName = req.file.originalname;
      pendingData.paperMimetype     = req.file.mimetype;
      pendingData.paperSize         = req.file.size;
      pendingData.paperUploadPath   = req.file.path;
    }

    pendingStore.set(tempId, { data: pendingData, expiresAt: Date.now() + PENDING_TTL_MS });

    const fee = FEE_MAP[body.category];
    return res.status(201).json({
      success: true,
      message: 'Registration details received. Please complete payment to confirm your registration.',
      data: { registrationId: tempId, status: 'pending_payment', fee },
    });
  } catch (err) {
    console.error('submitRegistration error:', err);
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
};

exports.getRegistrationStatus = async (req, res) => {
  try {
    const id = req.params.registrationId;

    // Check permanent DB first
    const reg = await Registration.findOne({ where: { registrationId: id } });
    if (reg) return res.json({ success: true, data: Registration.toApiShape(reg) });

    // Check pending store
    cleanExpired();
    const pending = pendingStore.get(id);
    if (pending) {
      return res.json({
        success: true,
        data: {
          ...pending.data,
          registrationId: id,
          status: 'pending_payment',
          _id: null,
        },
      });
    }

    return res.status(404).json({ success: false, message: 'Registration not found.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

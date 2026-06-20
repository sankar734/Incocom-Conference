// const path = require('path');
// const fs   = require('fs');
// const { Op } = require('sequelize');
// const Registration = require('../models/Registration');
// const { sendStatusUpdateEmail } = require('../utils/emailService');

// function aName(r) {
//   return [r.salutation, r.firstName, r.lastName].filter(Boolean).join(' ');
// }

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [total, pending, submitted, verified, rejected] = await Promise.all([
//       Registration.count(),
//       Registration.count({ where: { status: 'pending_payment' } }),
//       Registration.count({ where: { status: 'payment_submitted' } }),
//       Registration.count({ where: { status: 'payment_verified' } }),
//       Registration.count({ where: { status: 'rejected' } }),
//     ]);
//     res.json({ success: true, stats: { total, pending_payment: pending, payment_submitted: submitted, payment_verified: verified, rejected } });
//   } catch (e) { res.status(500).json({ success: false, message: e.message }); }
// };

// exports.getAllRegistrations = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 200, search = '' } = req.query;
//     const where = {};
//     if (status) where.status = status;
//     if (search.trim()) {
//       where[Op.or] = [
//         { firstName:      { [Op.like]: `%${search}%` } },
//         { lastName:       { [Op.like]: `%${search}%` } },
//         { email:          { [Op.like]: `%${search}%` } },
//         { paperTitle:     { [Op.like]: `%${search}%` } },
//         { registrationId: { [Op.like]: `%${search}%` } },
//         { collegeName:    { [Op.like]: `%${search}%` } },
//       ];
//     }
//     const total = await Registration.count({ where });
//     const regs  = await Registration.findAll({ where, order: [['createdAt','DESC']], limit: +limit, offset: (+page - 1) * +limit });
//     res.json({ success: true, data: regs.map(Registration.toApiShape), total });
//   } catch (e) { res.status(500).json({ success: false, message: e.message }); }
// };

// exports.getRegistrationById = async (req, res) => {
//   try {
//     const reg = await Registration.findByPk(req.params.id);
//     if (!reg) return res.status(404).json({ success: false, message: 'Not found.' });
//     res.json({ success: true, data: Registration.toApiShape(reg) });
//   } catch (e) { res.status(500).json({ success: false, message: e.message }); }
// };

// exports.updateStatus = async (req, res) => {
//   try {
//     const { status, adminRemarks } = req.body;
//     const allowed = ['pending_payment','payment_submitted','payment_verified','rejected'];
//     if (!status || !allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });
//     const reg = await Registration.findByPk(req.params.id);
//     if (!reg) return res.status(404).json({ success: false, message: 'Not found.' });
//     await reg.update({ status, adminRemarks: adminRemarks || '' });
//     const shaped = Registration.toApiShape(reg);
//     sendStatusUpdateEmail(shaped).catch(e => console.error('Email:', e.message));
//     res.json({ success: true, message: `Status updated to "${status}"`, data: shaped });
//   } catch (e) { res.status(500).json({ success: false, message: e.message }); }
// };

// exports.downloadPaper = async (req, res) => {
//   try {
//     const reg = await Registration.findByPk(req.params.id);
//     if (!reg?.paperUploadPath) return res.status(404).json({ success: false, message: 'No paper file uploaded.' });
//     if (!fs.existsSync(reg.paperUploadPath)) return res.status(404).json({ success: false, message: 'File not found on server.' });
//     res.setHeader('Content-Disposition', `attachment; filename="${reg.paperOriginalName || 'paper'}"`);
//     res.setHeader('Content-Type', reg.paperMimetype || 'application/octet-stream');
//     res.sendFile(path.resolve(reg.paperUploadPath));
//   } catch (e) { res.status(500).json({ success: false, message: e.message }); }
// };

// exports.viewScreenshot = async (req, res) => {
//   try {
//     const reg = await Registration.findByPk(req.params.id);
//     if (!reg?.paymentScreenshotPath) return res.status(404).json({ success: false, message: 'No screenshot uploaded.' });
//     if (!fs.existsSync(reg.paymentScreenshotPath)) return res.status(404).json({ success: false, message: 'Screenshot file not on server.' });
//     const ext  = path.extname(reg.paymentScreenshotOriginal || '').toLowerCase();
//     const mime = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf' };
//     res.setHeader('Content-Type', mime[ext] || 'image/jpeg');
//     res.setHeader('Content-Disposition', `inline; filename="${reg.paymentScreenshotOriginal || 'screenshot'}"`);
//     res.sendFile(path.resolve(reg.paymentScreenshotPath));
//   } catch (e) { res.status(500).json({ success: false, message: e.message }); }
// };



const path = require('path');
const fs   = require('fs');
const { Op } = require('sequelize');
const Registration = require('../models/Registration');
const { sendStatusUpdateEmail } = require('../utils/emailService');

// Helper: Full name
function aName(r) {
  return [r.salutation, r.firstName, r.lastName].filter(Boolean).join(' ');
}

/**
 * Dashboard Stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [total, pending, submitted, verified, rejected] = await Promise.all([
      Registration.count(),
      Registration.count({ where: { status: 'pending_payment' } }),
      Registration.count({ where: { status: 'payment_submitted' } }),
      Registration.count({ where: { status: 'payment_verified' } }),
      Registration.count({ where: { status: 'rejected' } }),
    ]);

    return res.json({
      success: true,
      stats: {
        total,
        pending_payment: pending,
        payment_submitted: submitted,
        payment_verified: verified,
        rejected,
      }
    });

  } catch (e) {
    console.error("Dashboard Error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * Get All Registrations
 */
exports.getAllRegistrations = async (req, res) => {
  try {
    let { status, page = 1, limit = 200, search = '' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const where = {};

    if (status) {
      where.status = status;
    }

    if (search && search.trim()) {
      where[Op.or] = [
        { firstName:      { [Op.like]: `%${search}%` } },
        { lastName:       { [Op.like]: `%${search}%` } },
        { email:          { [Op.like]: `%${search}%` } },
        { paperTitle:     { [Op.like]: `%${search}%` } },
        { registrationId: { [Op.like]: `%${search}%` } },
        { collegeName:    { [Op.like]: `%${search}%` } },
      ];
    }

    const total = await Registration.count({ where });

    const regs = await Registration.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return res.json({
      success: true,
      data: regs.map(r => Registration.toApiShape(r)), // FIXED
      total
    });

  } catch (e) {
    console.error("Fetch Error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * Get Single Registration
 */
exports.getRegistrationById = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id);

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Not found.' });
    }

    return res.json({
      success: true,
      data: Registration.toApiShape(reg)
    });

  } catch (e) {
    console.error("Get By ID Error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * Update Status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const allowed = [
      'pending_payment',
      'payment_submitted',
      'payment_verified',
      'rejected'
    ];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.'
      });
    }

    const reg = await Registration.findByPk(req.params.id);

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: 'Not found.'
      });
    }

    await reg.update({
      status,
      adminRemarks: adminRemarks || ''
    });

    const shaped = Registration.toApiShape(reg);

    // Don't crash app if email fails
    sendStatusUpdateEmail(shaped)
      .catch(e => console.error('Email Error:', e.message));

    return res.json({
      success: true,
      message: `Status updated to "${status}"`,
      data: shaped
    });

  } catch (e) {
    console.error("Update Error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * Download Paper
 */
exports.downloadPaper = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id);

    if (!reg || !reg.paperUploadPath) {
      return res.status(404).json({
        success: false,
        message: 'No paper file uploaded.'
      });
    }

    const filePath = path.resolve(reg.paperUploadPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server.'
      });
    }

    return res.download(
      filePath,
      reg.paperOriginalName || 'paper'
    );

  } catch (e) {
    console.error("Download Error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

/**
 * View Screenshot
 */
exports.viewScreenshot = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id);

    if (!reg || !reg.paymentScreenshotPath) {
      return res.status(404).json({
        success: false,
        message: 'No screenshot uploaded.'
      });
    }

    const filePath = path.resolve(reg.paymentScreenshotPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Screenshot file not on server.'
      });
    }

    const ext = path.extname(reg.paymentScreenshotOriginal || '').toLowerCase();

    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf'
    };

    res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="${reg.paymentScreenshotOriginal || 'screenshot'}"`);

    return res.sendFile(filePath);

  } catch (e) {
    console.error("Screenshot Error:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
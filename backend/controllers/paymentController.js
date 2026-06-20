// const path = require('path');
// const fs   = require('fs');
// const Registration = require('../models/Registration');
// const { sendPaymentReceiptEmail } = require('../utils/emailService');
// const { pendingStore } = require('./registrationController');

// const FEE_MAP = {
//   'Foreigners & NRI':                     { amount: 940,  display: '$10 / ₹940',  sno: '01' },
//   'Academicians and Corporate Delegates': { amount: 1000, display: 'Rs.1000/-',   sno: '02' },
//   'Research Scholars and PG Students':    { amount: 500,  display: 'Rs.500/-',    sno: '03' },
//   'NPR Staff':                            { amount: 500,  display: 'Rs.500/-',    sno: '04' },
//   'NPR Students':                         { amount: 300,  display: 'Rs.300/-',    sno: '05' },
// };

// // Helper: resolve registration from DB or pending store
// async function resolveRegistration(registrationId) {
//   // Check DB first (already saved)
//   const dbReg = await Registration.findOne({ where: { registrationId } });
//   if (dbReg) return { source: 'db', reg: dbReg, data: Registration.toApiShape(dbReg) };

//   // Check in-memory pending store
//   const pending = pendingStore.get(registrationId);
//   if (pending) {
//     if (pending.expiresAt < Date.now()) {
//       pendingStore.delete(registrationId);
//       return null;
//     }
//     return { source: 'pending', reg: null, data: { ...pending.data, registrationId, status: 'pending_payment' } };
//   }

//   return null;
// }

// exports.getPaymentDetails = async (req, res) => {
//   try {
//     const result = await resolveRegistration(req.params.registrationId);
//     if (!result) return res.status(404).json({ success: false, message: 'Registration not found or session expired. Please register again.' });

//     const fee = FEE_MAP[result.data.category] || { amount: 500, display: 'Rs.500/-' };
//     res.json({ success: true, data: result.data, fee, feeMap: FEE_MAP });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.submitPayment = async (req, res) => {
//   try {
//     const { registrationId, transactionId, method } = req.body;
//     if (!registrationId) return res.status(400).json({ success: false, message: 'Registration ID required.' });
//     if (!transactionId || transactionId.trim().length < 4)
//       return res.status(400).json({ success: false, message: 'Valid Transaction ID required.' });

//     const result = await resolveRegistration(registrationId);
//     if (!result) return res.status(404).json({ success: false, message: 'Registration not found or session expired. Please register again.' });

//     const fee = FEE_MAP[result.data.category] || { amount: 500 };

//     let savedReg;

//     if (result.source === 'db') {
//       // Already in DB (e.g. re-submission) — just update payment fields
//       const reg = result.reg;
//       if (reg.status === 'payment_verified')
//         return res.status(400).json({ success: false, message: 'Payment already verified.' });

//       const updateData = {
//         status: 'payment_submitted',
//         paymentMethod:        method || 'GPay / UPI',
//         paymentTransactionId: transactionId.trim().toUpperCase(),
//         paymentAmount:        fee.amount,
//         paymentPaidAt:        new Date(),
//       };
//       if (req.file) {
//         updateData.paymentScreenshotFile     = req.file.filename;
//         updateData.paymentScreenshotOriginal = req.file.originalname;
//         updateData.paymentScreenshotPath     = req.file.path;
//       }
//       await reg.update(updateData);
//       savedReg = reg;

//     } else {
//       // Pending store — NOW save to DB for the first time
//       const pendingData = result.data;

//       const newReg = await Registration.create({
//         ...pendingData,
//         status:               'payment_submitted',
//         paymentMethod:        method || 'GPay / UPI',
//         paymentTransactionId: transactionId.trim().toUpperCase(),
//         paymentAmount:        fee.amount,
//         paymentPaidAt:        new Date(),
//         ...(req.file ? {
//           paymentScreenshotFile:     req.file.filename,
//           paymentScreenshotOriginal: req.file.originalname,
//           paymentScreenshotPath:     req.file.path,
//         } : {}),
//       });

//       // Remove from pending store now that it's persisted
//       pendingStore.delete(registrationId);
//       savedReg = newReg;
//     }

//     const shaped = Registration.toApiShape(savedReg);
//     sendPaymentReceiptEmail(shaped).catch(e => console.error('Receipt email error:', e.message));

//     const authorName = [savedReg.salutation, savedReg.firstName, savedReg.lastName].filter(Boolean).join(' ');
//     res.json({
//       success: true,
//       message: 'Payment submitted! Our team will verify within 24 hours and send confirmation to your email.',
//       receipt: {
//         registrationId:      savedReg.registrationId,
//         authorName,
//         email:               savedReg.email,
//         phone:               savedReg.phone,
//         paperTitle:          savedReg.paperTitle,
//         subTheme:            savedReg.subTheme,
//         collegeName:         savedReg.collegeName,
//         category:            savedReg.category,
//         transactionId:       transactionId.trim().toUpperCase(),
//         method:              method || 'GPay / UPI',
//         amount:              fee.amount,
//         screenshotUploaded:  !!req.file,
//         paidAt:              new Date(),
//         conferenceDate:      '21.04.2026 (Tuesday)',
//         venue:               'Dr. APJ. Abdul Kalam Hall, NPR College of Engineering and Technology, Natham, Dindigul – 624 401',
//       },
//     });
//   } catch (err) {
//     console.error('submitPayment error:', err);
//     res.status(500).json({ success: false, message: 'Server error: ' + err.message });
//   }
// };

// exports.verifyPayment = async (req, res) => {
//   try {
//     const { registrationId, adminRemarks } = req.body;
//     const reg = await Registration.findOne({ where: { registrationId } });
//     if (!reg) return res.status(404).json({ success: false, message: 'Not found.' });
//     await reg.update({ status: 'payment_verified', adminRemarks: adminRemarks || 'Payment verified by admin.' });
//     res.json({ success: true, message: 'Payment verified!', data: Registration.toApiShape(reg) });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.viewScreenshot = async (req, res) => {
//   try {
//     const reg = await Registration.findByPk(req.params.id);
//     if (!reg) return res.status(404).json({ success: false, message: 'Not found.' });
//     if (!reg.paymentScreenshotPath) return res.status(404).json({ success: false, message: 'No screenshot uploaded.' });
//     if (!fs.existsSync(reg.paymentScreenshotPath)) return res.status(404).json({ success: false, message: 'File not found on server.' });
//     const ext  = path.extname(reg.paymentScreenshotOriginal || '').toLowerCase();
//     const mime = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf' };
//     res.setHeader('Content-Type', mime[ext] || 'image/jpeg');
//     res.setHeader('Content-Disposition', `inline; filename="${reg.paymentScreenshotOriginal || 'screenshot'}"`);
//     res.sendFile(path.resolve(reg.paymentScreenshotPath));
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


const path = require('path');
const fs   = require('fs');
const Registration = require('../models/Registration');
const { sendPaymentReceiptEmail } = require('../utils/emailService');
const { pendingStore } = require('./registrationController');

const FEE_MAP = {
  'Foreigners & NRI':                     { amount: 940 },
  'Academicians and Corporate Delegates': { amount: 1000 },
  'Research Scholars and PG Students':    { amount: 500 },
  'NPR Staff':                            { amount: 500 },
  'NPR Students':                         { amount: 300 },
};

// 🔹 Resolve registration
async function resolveRegistration(registrationId) {
  const dbReg = await Registration.findOne({ where: { registrationId } });
  if (dbReg) return { source: 'db', reg: dbReg, data: Registration.toApiShape(dbReg) };

  const pending = pendingStore.get(registrationId);
  if (pending) {
    if (pending.expiresAt < Date.now()) {
      pendingStore.delete(registrationId);
      return null;
    }
    return {
      source: 'pending',
      data: { ...pending.data, registrationId, status: 'pending_payment' }
    };
  }

  return null;
}

// 🔹 Get Payment Details
exports.getPaymentDetails = async (req, res) => {
  try {
    const result = await resolveRegistration(req.params.registrationId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Registration expired. Please register again.'
      });
    }

    const fee = FEE_MAP[result.data.category] || { amount: 500 };

    return res.json({
      success: true,
      data: result.data,
      fee
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Submit Payment
exports.submitPayment = async (req, res) => {
  try {
    let { registrationId, transactionId, method } = req.body;

    if (!registrationId) {
      return res.status(400).json({ success: false, message: 'Registration ID required' });
    }

    if (!transactionId || transactionId.trim().length < 4) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
    }

    // ✅ FIX: limit ID length (prevents DB crash)
    if (registrationId.length > 50) {
      registrationId = registrationId.substring(0, 50);
    }

    const result = await resolveRegistration(registrationId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found or expired'
      });
    }

    const fee = FEE_MAP[result.data.category] || { amount: 500 };

    let savedReg;

    // 🔹 Update existing record
    if (result.source === 'db') {
      const reg = result.reg;

      if (reg.status === 'payment_verified') {
        return res.status(400).json({
          success: false,
          message: 'Already verified'
        });
      }

      await reg.update({
        status: 'payment_submitted',
        paymentMethod: method || 'UPI',
        paymentTransactionId: transactionId.trim().toUpperCase(),
        paymentAmount: fee.amount,
        paymentPaidAt: new Date(),
        ...(req.file && {
          paymentScreenshotFile: req.file.filename,
          paymentScreenshotOriginal: req.file.originalname,
          paymentScreenshotPath: req.file.path
        })
      });

      savedReg = reg;

    } else {
      // 🔹 Save new record
      const newReg = await Registration.create({
        ...result.data,
        registrationId, // ✅ safe
        status: 'payment_submitted',
        paymentMethod: method || 'UPI',
        paymentTransactionId: transactionId.trim().toUpperCase(),
        paymentAmount: fee.amount,
        paymentPaidAt: new Date(),
        ...(req.file && {
          paymentScreenshotFile: req.file.filename,
          paymentScreenshotOriginal: req.file.originalname,
          paymentScreenshotPath: req.file.path
        })
      });

      pendingStore.delete(registrationId);
      savedReg = newReg;
    }

    const shaped = Registration.toApiShape(savedReg);

    sendPaymentReceiptEmail(shaped)
      .catch(err => console.error('Email error:', err.message));

    return res.json({
      success: true,
      message: 'Payment submitted successfully',
      data: shaped
    });

  } catch (err) {
    console.error('submitPayment error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// 🔹 Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { registrationId, adminRemarks } = req.body;

    const reg = await Registration.findOne({ where: { registrationId } });

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    await reg.update({
      status: 'payment_verified',
      adminRemarks: adminRemarks || 'Verified'
    });

    res.json({
      success: true,
      message: 'Payment verified',
      data: Registration.toApiShape(reg)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 View Screenshot
exports.viewScreenshot = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id);

    if (!reg || !reg.paymentScreenshotPath) {
      return res.status(404).json({ success: false, message: 'No screenshot found' });
    }

    const filePath = path.resolve(reg.paymentScreenshotPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    return res.sendFile(filePath);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
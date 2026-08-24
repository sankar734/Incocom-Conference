const path = require('path');
const fs   = require('fs');
const Registration = require('../models/Registration');
const { sendPaymentReceiptEmail } = require('../utils/emailService');
const { pendingStore } = require('./registrationController');

const FEE_MAP = {
  'Foreigners & NRI':                     { amount: 940,  display: '$10 / ₹940',  sno: '01' },
  'Academicians and Corporate Delegates': { amount: 1000, display: 'Rs.1000/-',   sno: '02' },
  'Research Scholars and PG Students':    { amount: 500,  display: 'Rs.500/-',    sno: '03' },
  'NPR Staff':                            { amount: 500,  display: 'Rs.500/-',    sno: '04' },
  'NPR Students':                         { amount: 300,  display: 'Rs.300/-',    sno: '05' },
};

// Helper: resolve registration from DB or pending store
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
      reg: null,
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
        message: 'Registration not found or session expired. Please register again.'
      });
    }

    const fee = FEE_MAP[result.data.category] || { amount: 500, display: 'Rs.500/-' };

    return res.json({
      success: true,
      data: result.data,
      fee,
      feeMap: FEE_MAP
    });

  } catch (err) {
    console.error('getPaymentDetails error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Submit Payment
exports.submitPayment = async (req, res) => {
  try {
    let { registrationId, transactionId, method } = req.body;

    if (!registrationId) {
      return res.status(400).json({ success: false, message: 'Registration ID required.' });
    }

    if (!transactionId || transactionId.trim().length < 4) {
      return res.status(400).json({ success: false, message: 'Valid Transaction ID required.' });
    }

    if (registrationId.length > 50) {
      registrationId = registrationId.substring(0, 50);
    }

    const result = await resolveRegistration(registrationId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found or session expired. Please register again.'
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
          message: 'Payment already verified.'
        });
      }

      await reg.update({
        status: 'payment_submitted',
        paymentMethod: method || 'GPay / UPI',
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
      // 🔹 Save new record from pending store
      const newReg = await Registration.create({
        ...result.data,
        registrationId,
        status: 'payment_submitted',
        paymentMethod: method || 'GPay / UPI',
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
      .catch(err => console.error('Receipt email error:', err.message));

    const authorName = [savedReg.salutation, savedReg.firstName, savedReg.lastName].filter(Boolean).join(' ');

    const receipt = {
      registrationId:      savedReg.registrationId,
      authorName,
      email:               savedReg.email,
      phone:               savedReg.phone,
      paperTitle:          savedReg.paperTitle,
      subTheme:            savedReg.subTheme,
      collegeName:         savedReg.collegeName,
      category:            savedReg.category,
      transactionId:       transactionId.trim().toUpperCase(),
      method:              method || 'GPay / UPI',
      amount:              fee.amount,
      screenshotUploaded:  !!req.file,
      paidAt:              savedReg.paymentPaidAt || new Date(),
      conferenceDate:      '21.04.2026 (Tuesday)',
      venue:               'Dr. APJ. Abdul Kalam Hall, NPR College of Engineering and Technology, Natham, Dindigul – 624 401',
    };

    return res.json({
      success: true,
      message: 'Payment submitted! Our team will verify within 24 hours and send confirmation to your email.',
      data: shaped,
      receipt
    });

  } catch (err) {
    console.error('submitPayment error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
};

// 🔹 Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { registrationId, adminRemarks } = req.body;

    const reg = await Registration.findOne({ where: { registrationId } });

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    await reg.update({
      status: 'payment_verified',
      adminRemarks: adminRemarks || 'Payment verified by admin.'
    });

    res.json({
      success: true,
      message: 'Payment verified successfully!',
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
      return res.status(404).json({ success: false, message: 'No screenshot uploaded.' });
    }

    const filePath = path.resolve(reg.paymentScreenshotPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Screenshot file not found on server.' });
    }

    const ext = path.extname(reg.paymentScreenshotOriginal || '').toLowerCase();
    const mimeTypes = {
      '.jpg':  'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png':  'image/png',
      '.webp': 'image/webp',
      '.pdf':  'application/pdf'
    };

    res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="${reg.paymentScreenshotOriginal || 'screenshot'}"`);
    return res.sendFile(filePath);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// const nodemailer = require('nodemailer');

// function createTransporter() {
//   if (!process.env.EMAIL_USER) return null;
//   return nodemailer.createTransport({
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: Number(process.env.EMAIL_PORT) || 587,
//     secure: false,
//     auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//   });
// }

// function fullName(r) {
//   return [r.salutation, r.firstName, r.initial ? r.initial + '.' : '', r.lastName].filter(Boolean).join(' ');
// }

// const HEADER = (title, sub) => `
// <div style="background:linear-gradient(135deg,#0a1628,#1a3a6b);padding:32px 40px;text-align:center;">
//   <div style="font-size:28px;font-weight:900;color:#f0c040;font-family:Georgia,serif;margin-bottom:4px;">INCOCOM 2K26</div>
//   <div style="font-size:13px;color:rgba(255,255,255,0.7);">6th International Conference on Contemporary Management &amp; Computing</div>
//   ${title ? `<div style="margin-top:16px;font-size:20px;font-weight:bold;color:#fff;">${title}</div>` : ''}
//   ${sub   ? `<div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px;">${sub}</div>` : ''}
// </div>`;

// const FOOTER = `
// <div style="background:#f8fafc;padding:18px 40px;text-align:center;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;">
//   NPR College of Engineering and Technology · Natham, Dindigul – 624 401, Tamil Nadu<br/>
//   nprcetincocom@nprcolleges.org · www.nprcet.edu.in
// </div>`;

// const ROW = (label, value) => `
// <tr>
//   <td style="padding:8px 0;color:#64748b;font-size:13px;width:170px;vertical-align:top;">${label}</td>
//   <td style="padding:8px 0;color:#1e293b;font-size:13px;font-weight:600;">${value || '—'}</td>
// </tr>`;

// /* ── 1. Registration Confirmation ─────────────────────────────────────────── */
// exports.sendConfirmationEmail = async (reg) => {
//   const name = fullName(reg);
//   console.log(`📧 Confirmation → ${reg.email} [${reg.registrationId}]`);
//   const t = createTransporter();
//   if (!t) { console.log('📧 [MOCK] Confirmation email (no EMAIL_USER set)'); return { success: true, mock: true }; }
//   await t.sendMail({
//     from:    `"INCOCOM 2K26" <${process.env.EMAIL_USER}>`,
//     to:      reg.email,
//     subject: `✅ INCOCOM 2K26 – Registration Received [${reg.registrationId}]`,
//     html: `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#f5f7fb;font-family:Arial,sans-serif;">
// <div style="max-width:580px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
//   ${HEADER('Registration Received ✅', 'Your paper has been submitted successfully')}
//   <div style="padding:32px 40px;">
//     <p style="font-size:15px;color:#475569;margin:0 0 16px;">Dear <strong>${name}</strong>,</p>
//     <p style="font-size:14px;color:#475569;margin:0 0 20px;">Your paper has been successfully registered for <strong>INCOCOM 2K26</strong>. Please proceed to complete your payment to confirm registration.</p>
//     <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:0 0 20px;">
//       <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#166534;margin-bottom:12px;">Registration Details</div>
//       <table style="width:100%;border-collapse:collapse;">
//         ${ROW('Registration ID', `<span style="font-family:monospace;color:#0d7e8a;font-size:14px;">${reg.registrationId}</span>`)}
//         ${ROW('Author Name', name)}
//         ${ROW('Paper Title', reg.paperTitle)}
//         ${ROW('Sub-Theme', reg.subTheme)}
//         ${ROW('Category', reg.category)}
//         ${ROW('Status', '<span style="background:#fef3c7;color:#92400e;padding:2px 10px;border-radius:100px;font-size:12px;font-weight:700;">Pending Payment</span>')}
//       </table>
//     </div>
//     <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 20px;">
//       <strong style="color:#1e40af;font-size:13px;">💳 Next Step: Complete Payment</strong>
//       <p style="margin:6px 0 0;font-size:13px;color:#3b82f6;">Please proceed to the payment page to complete your registration. Scan the GPay QR code or use the UPI ID provided.</p>
//     </div>
//     <div style="background:#f8fafc;border-radius:10px;padding:14px 18px;font-size:13px;color:#475569;">
//       📅 <strong>Conference Date:</strong> 21.04.2026 (Tuesday)<br/>
//       📍 <strong>Venue:</strong> Dr. APJ. Abdul Kalam Hall, NPR CET, Dindigul<br/>
//       🌐 <strong>Mode:</strong> Hybrid (Online + Offline)
//     </div>
//   </div>
//   ${FOOTER}
// </div></body></html>`,
//   });
//   return { success: true };
// };

// /* ── 2. Payment Receipt ────────────────────────────────────────────────────── */
// exports.sendPaymentReceiptEmail = async (reg) => {
//   const name = fullName(reg);
//   console.log(`📧 Payment Receipt → ${reg.email} [${reg.registrationId}]`);
//   const t = createTransporter();
//   if (!t) { console.log('📧 [MOCK] Payment receipt email (no EMAIL_USER set)'); return { success: true, mock: true }; }
//   const pd = reg.paymentDetails || {};
//   const coList = reg.coAuthors?.length
//     ? reg.coAuthors.map(c => `${c.salutation} ${c.firstName} ${c.initial ? c.initial + '.' : ''} ${c.lastName}${c.collegeName ? ' (' + c.collegeName + ')' : ''}`).join('; ')
//     : 'None';
//   await t.sendMail({
//     from:    `"INCOCOM 2K26" <${process.env.EMAIL_USER}>`,
//     to:      reg.email,
//     subject: `💳 INCOCOM 2K26 – Payment Received & Registration Confirmation [${reg.registrationId}]`,
//     html: `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#f5f7fb;font-family:Arial,sans-serif;">
// <div style="max-width:580px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
//   ${HEADER('Payment Received ✅', 'Your registration is now confirmed')}
//   <div style="padding:32px 40px;">
//     <p style="font-size:15px;color:#475569;margin:0 0 20px;">Dear <strong>${name}</strong>, your payment has been received and your participation in <strong>INCOCOM 2K26</strong> is confirmed.</p>

//     <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:0 0 16px;">
//       <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#166534;margin-bottom:12px;">📄 Payment Receipt</div>
//       <table style="width:100%;border-collapse:collapse;">
//         ${ROW('Registration ID', `<span style="font-family:monospace;color:#0d7e8a;font-size:14px;">${reg.registrationId}</span>`)}
//         ${ROW('Transaction ID', `<span style="font-family:monospace;font-weight:700;">${pd.transactionId || '—'}</span>`)}
//         ${ROW('Payment Method', pd.method || 'GPay / UPI')}
//         ${ROW('Category', reg.category)}
//         ${ROW('Amount Paid', `<strong style="font-size:16px;color:#166534;">₹ ${pd.amount || 0}/-</strong>`)}
//         ${ROW('Payment Date', pd.paidAt ? new Date(pd.paidAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : '—')}
//         ${ROW('Screenshot', pd.screenshotFile ? '✅ Uploaded' : 'Not uploaded')}
//         ${ROW('Status', '<span style="background:#dcfce7;color:#166534;padding:2px 10px;border-radius:100px;font-size:12px;font-weight:700;">Payment Submitted</span>')}
//       </table>
//     </div>

//     <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin:0 0 16px;">
//       <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0a1628;margin-bottom:12px;">📋 Paper Details</div>
//       <table style="width:100%;border-collapse:collapse;">
//         ${ROW('Author', name)}
//         ${ROW('Co-Authors', coList)}
//         ${ROW('Institution', `${reg.collegeName}, ${reg.city}, ${reg.district}`)}
//         ${ROW('Paper Title', reg.paperTitle)}
//         ${ROW('Sub-Theme', reg.subTheme)}
//         ${ROW('Keywords', reg.keywords || '—')}
//         ${ROW('Paper File', reg.paperFile?.originalName || 'Not uploaded')}
//       </table>
//     </div>

//     <div style="background:#0a1628;border-radius:12px;padding:20px 24px;text-align:center;margin:0 0 16px;">
//       <div style="font-size:16px;font-weight:bold;color:#f0c040;margin-bottom:6px;">📅 Conference: 21st April 2026 (Tuesday)</div>
//       <div style="font-size:13px;color:rgba(255,255,255,0.7);">Dr. APJ. Abdul Kalam Hall · NPR College of Engineering and Technology</div>
//       <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px;">Natham, Dindigul (Dist.) – 624 401, Tamil Nadu | Hybrid Mode</div>
//     </div>

//     <div style="background:#fefce8;border:1px solid #fde047;border-radius:10px;padding:14px 18px;font-size:13px;color:#713f12;">
//       ⚠️ <strong>Note:</strong> Our team will verify your payment within 24 hours. You will receive a final confirmation email once verified. Please keep your Transaction ID <strong>${pd.transactionId || ''}</strong> for reference.
//     </div>
//     <p style="font-size:13px;color:#94a3b8;margin:16px 0 0;">Please bring a printout of this receipt to the conference.</p>
//   </div>
//   ${FOOTER}
// </div></body></html>`,
//   });
//   return { success: true };
// };

// /* ── 3. Status Update ──────────────────────────────────────────────────────── */
// exports.sendStatusUpdateEmail = async (reg) => {
//   const name = fullName(reg);
//   console.log(`📧 Status Update → ${reg.email} [${reg.status}]`);
//   const t = createTransporter();
//   if (!t) { console.log('📧 [MOCK] Status update email (no EMAIL_USER set)'); return { success: true, mock: true }; }

//   const statusInfo = {
//     payment_verified: {
//       subject: '✅ INCOCOM 2K26 – Payment Verified & Registration Confirmed',
//       icon: '🎉', color: '#22c55e',
//       heading: 'Payment Verified – Registration Confirmed!',
//       body: 'Congratulations! Your payment has been verified by our team. Your registration for INCOCOM 2K26 is now <strong>officially confirmed</strong>.',
//     },
//     rejected: {
//       subject: '📋 INCOCOM 2K26 – Registration Update',
//       icon: '📋', color: '#ef4444',
//       heading: 'Registration Update',
//       body: 'Thank you for your submission to INCOCOM 2K26. After careful review, we regret to inform that your registration could not be processed. Please contact us for more details.',
//     },
//   };

//   const info = statusInfo[reg.status];
//   if (!info) return { success: false, reason: 'No template for this status' };

//   await t.sendMail({
//     from:    `"INCOCOM 2K26" <${process.env.EMAIL_USER}>`,
//     to:      reg.email,
//     subject: info.subject,
//     html: `<!DOCTYPE html><html><body style="margin:0;padding:20px;background:#f5f7fb;font-family:Arial,sans-serif;">
// <div style="max-width:580px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
//   ${HEADER(info.heading, '')}
//   <div style="padding:32px 40px;">
//     <div style="text-align:center;font-size:52px;margin-bottom:16px;">${info.icon}</div>
//     <p style="font-size:15px;color:#475569;">Dear <strong>${name}</strong>,</p>
//     <p style="font-size:14px;color:#475569;line-height:1.7;">${info.body}</p>
//     <div style="background:#f8fafc;border-radius:10px;padding:14px 18px;margin:16px 0;">
//       <table style="width:100%;border-collapse:collapse;">
//         ${ROW('Registration ID', `<span style="font-family:monospace;color:#0d7e8a;">${reg.registrationId}</span>`)}
//         ${ROW('Paper Title', reg.paperTitle)}
//         ${reg.adminRemarks ? ROW('Remarks', reg.adminRemarks) : ''}
//       </table>
//     </div>
//     ${reg.status === 'payment_verified' ? `
//     <div style="background:#0a1628;border-radius:12px;padding:18px 24px;text-align:center;">
//       <div style="font-size:15px;font-weight:bold;color:#f0c040;">📅 Conference: 21st April 2026</div>
//       <div style="font-size:13px;color:rgba(255,255,255,0.65);margin-top:4px;">Dr. APJ. Abdul Kalam Hall, NPR CET, Dindigul</div>
//     </div>` : ''}
//     <p style="font-size:13px;color:#94a3b8;margin:16px 0 0;">For queries: nprcetincocom@nprcolleges.org | +91-99438 19028</p>
//   </div>
//   ${FOOTER}
// </div></body></html>`,
//   });
//   return { success: true };
// };


const nodemailer = require('nodemailer');

/**
 * Create transporter (safe)
 */
function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email config missing');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // ✅ simpler than host/port
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Full name
 */
function fullName(r) {
  return [
    r.salutation,
    r.firstName,
    r.initial ? r.initial + '.' : '',
    r.lastName
  ].filter(Boolean).join(' ');
}

/**
 * Common mail sender (IMPORTANT FIX)
 */
async function sendMailSafe(mailOptions, reg) {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.log('📧 [MOCK] Email skipped');
      return;
    }

    // ✅ ALWAYS send to user email
    if (!reg?.email) {
      console.log('❌ No user email');
      return;
    }

    mailOptions.to = reg.email;

    await transporter.sendMail(mailOptions);

    console.log('📧 Email sent →', reg.email);

  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
}

/* ───────── 1. Registration Confirmation ───────── */
exports.sendConfirmationEmail = async (reg) => {
  const name = fullName(reg);

  await sendMailSafe({
    from: `"INCOCOM 2K26" <${process.env.EMAIL_USER}>`,
    subject: `Registration Received [${reg.registrationId}]`,
    html: `
      <h2>Registration Successful</h2>
      <p>Dear ${name},</p>
      <p>Your registration is received.</p>
      <p><b>ID:</b> ${reg.registrationId}</p>
      <p><b>Paper:</b> ${reg.paperTitle}</p>
    `
  }, reg);
};

/* ───────── 2. Payment Receipt ───────── */
exports.sendPaymentReceiptEmail = async (reg) => {
  const name = fullName(reg);
  const pd = reg.paymentDetails || {};

  await sendMailSafe({
    from: `"INCOCOM 2K26" <${process.env.EMAIL_USER}>`,
    subject: `Payment Receipt [${reg.registrationId}]`,
    html: `
      <h2>Payment Confirmation</h2>

      <p>Dear ${name},</p>

      <p>Your payment has been successfully submitted.</p>

      <table border="1" cellpadding="8">
        <tr><td><b>Registration ID</b></td><td>${reg.registrationId}</td></tr>
        <tr><td><b>Name</b></td><td>${name}</td></tr>
        <tr><td><b>Email</b></td><td>${reg.email}</td></tr>
        <tr><td><b>Transaction ID</b></td><td>${pd.transactionId || '-'}</td></tr>
        <tr><td><b>Amount</b></td><td>₹${pd.amount || 0}</td></tr>
        <tr><td><b>Status</b></td><td>${reg.status}</td></tr>
      </table>

      <p>Thank you for registering!</p>
    `
  }, reg);
};

/* ───────── 3. Status Update ───────── */
exports.sendStatusUpdateEmail = async (reg) => {
  const name = fullName(reg);

  await sendMailSafe({
    from: `"INCOCOM 2K26" <${process.env.EMAIL_USER}>`,
    subject: `Status Update - ${reg.status}`,
    html: `
      <h2>Status Update</h2>

      <p>Dear ${name},</p>

      <p>Your registration status is now:</p>
      <h3>${reg.status}</h3>

      ${reg.adminRemarks ? `<p><b>Remarks:</b> ${reg.adminRemarks}</p>` : ''}
    `
  }, reg);
};
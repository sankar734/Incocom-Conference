// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/database');

// const Registration = sequelize.define('Registration', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   registrationId: { type: DataTypes.STRING(20), unique: true, allowNull: false, defaultValue: '' },
//   salutation:  { type: DataTypes.STRING(10), allowNull: false },
//   firstName:   { type: DataTypes.STRING(100), allowNull: false },
//   lastName:    { type: DataTypes.STRING(100), allowNull: false },
//   designation: { type: DataTypes.STRING(200), allowNull: false },
//   department:  { type: DataTypes.STRING(200), allowNull: false },
//   collegeName:    { type: DataTypes.STRING(300), allowNull: false },
//   collegeAddress: { type: DataTypes.STRING(500), allowNull: false },
//   district:       { type: DataTypes.STRING(100), allowNull: false },
//   phone:       { type: DataTypes.STRING(20),  allowNull: false },
//   email:       { type: DataTypes.STRING(200), allowNull: false },
//   category: {
//     type: DataTypes.ENUM(
//       'Foreigners & NRI',
//       'Academicians and Corporate Delegates',
//       'Research Scholars and PG Students',
//       'NPR Staff',
//       'NPR Students'
//     ),
//     allowNull: false,
//   },
//   coAuthors: {
//     type: DataTypes.TEXT('long'),
//     defaultValue: '[]',
//     get() { try { return JSON.parse(this.getDataValue('coAuthors') || '[]'); } catch { return []; } },
//     set(val) { this.setDataValue('coAuthors', JSON.stringify(val || [])); },
//   },
//   paperTitle: { type: DataTypes.TEXT, allowNull: false },
//   subTheme:   { type: DataTypes.STRING(300), allowNull: false },
//   keywords:   { type: DataTypes.STRING(500), defaultValue: '' },
//   abstract:   { type: DataTypes.TEXT('long'), allowNull: false },
//   paperFilename:     { type: DataTypes.STRING(300), defaultValue: '' },
//   paperOriginalName: { type: DataTypes.STRING(300), defaultValue: '' },
//   paperMimetype:     { type: DataTypes.STRING(100), defaultValue: '' },
//   paperSize:         { type: DataTypes.INTEGER, defaultValue: 0 },
//   paperUploadPath:   { type: DataTypes.STRING(500), defaultValue: '' },
//   status: {
//     type: DataTypes.ENUM('pending_payment', 'payment_submitted', 'payment_verified', 'rejected'),
//     defaultValue: 'pending_payment',
//   },
//   adminRemarks: { type: DataTypes.TEXT, defaultValue: '' },
//   paymentMethod:            { type: DataTypes.STRING(50),  defaultValue: '' },
//   paymentTransactionId:     { type: DataTypes.STRING(100), defaultValue: '' },
//   paymentAmount:            { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
//   paymentPaidAt:            { type: DataTypes.DATE, allowNull: true },
//   paymentReceiptSent:       { type: DataTypes.BOOLEAN, defaultValue: false },
//   paymentScreenshotFile:    { type: DataTypes.STRING(300), defaultValue: '' },
//   paymentScreenshotOriginal:{ type: DataTypes.STRING(300), defaultValue: '' },
//   paymentScreenshotPath:    { type: DataTypes.STRING(500), defaultValue: '' },
// }, {
//   tableName: 'registrations',
//   timestamps: true,
//   hooks: {
//     beforeCreate(rec) {
//       if (!rec.registrationId) {
//         const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
//         let id = 'INCO-2K26-';
//         for (let i = 0; i < 6; i++) id += c[Math.floor(Math.random() * c.length)];
//         rec.registrationId = id;
//       }
//       if (rec.email) rec.email = rec.email.toLowerCase().trim();
//     },
//   },
// });

// Registration.toApiShape = (reg) => {
//   if (!reg) return null;
//   const d = reg.toJSON ? reg.toJSON() : { ...reg };
//   return {
//     ...d,
//     _id: d.id,
//     paperFile: {
//       filename: d.paperFilename, originalName: d.paperOriginalName,
//       mimetype: d.paperMimetype, size: d.paperSize, uploadPath: d.paperUploadPath,
//     },
//     paymentDetails: {
//       method: d.paymentMethod, transactionId: d.paymentTransactionId,
//       amount: d.paymentAmount, paidAt: d.paymentPaidAt,
//       receiptSent: d.paymentReceiptSent,
//       screenshotFile: d.paymentScreenshotFile,
//       screenshotOriginal: d.paymentScreenshotOriginal,
//       screenshotPath: d.paymentScreenshotPath,
//     },
//   };
// };

// module.exports = Registration;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Registration = sequelize.define('Registration', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },

  // 🔥 FIXED: increased size
  registrationId: { 
    type: DataTypes.STRING(50), 
    unique: true, 
    allowNull: false 
  },

  salutation:  { type: DataTypes.STRING(10), allowNull: false },
  firstName:   { type: DataTypes.STRING(100), allowNull: false },
  lastName:    { type: DataTypes.STRING(100), allowNull: false },
  designation: { type: DataTypes.STRING(200), allowNull: false },
  department:  { type: DataTypes.STRING(200), allowNull: false },

  collegeName:    { type: DataTypes.STRING(300), allowNull: false },
  collegeAddress: { type: DataTypes.STRING(500), allowNull: false },
  district:       { type: DataTypes.STRING(100), allowNull: false },

  phone: { type: DataTypes.STRING(20), allowNull: false },

  email: { 
    type: DataTypes.STRING(200), 
    allowNull: false,
    validate: { isEmail: true }
  },

  category: {
    type: DataTypes.ENUM(
      'Foreigners & NRI',
      'Academicians and Corporate Delegates',
      'Research Scholars and PG Students',
      'NPR Staff',
      'NPR Students'
    ),
    allowNull: false
  },

  coAuthors: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    get() {
      try {
        const val = this.getDataValue('coAuthors');
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    },
    set(val) {
      this.setDataValue('coAuthors', JSON.stringify(val || []));
    }
  },

  paperTitle: { type: DataTypes.TEXT, allowNull: false },
  subTheme:   { type: DataTypes.STRING(300), allowNull: false },
  keywords:   { type: DataTypes.STRING(500), defaultValue: '' },
  abstract:   { type: DataTypes.TEXT('long'), allowNull: false },

  // Paper Upload
  paperFilename:     { type: DataTypes.STRING(300), defaultValue: '' },
  paperOriginalName: { type: DataTypes.STRING(300), defaultValue: '' },
  paperMimetype:     { type: DataTypes.STRING(100), defaultValue: '' },
  paperSize:         { type: DataTypes.INTEGER, defaultValue: 0 },
  paperUploadPath:   { type: DataTypes.STRING(500), defaultValue: '' },

  // Status
  status: {
    type: DataTypes.ENUM(
      'pending_payment',
      'payment_submitted',
      'payment_verified',
      'rejected'
    ),
    defaultValue: 'pending_payment'
  },

  adminRemarks: { type: DataTypes.TEXT, defaultValue: '' },

  // Payment
  paymentMethod:        { type: DataTypes.STRING(50), defaultValue: '' },
  paymentTransactionId: { type: DataTypes.STRING(100), defaultValue: '' },
  paymentAmount:        { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  paymentPaidAt:        { type: DataTypes.DATE, allowNull: true },
  paymentReceiptSent:   { type: DataTypes.BOOLEAN, defaultValue: false },

  // Screenshot
  paymentScreenshotFile:     { type: DataTypes.STRING(300), defaultValue: '' },
  paymentScreenshotOriginal: { type: DataTypes.STRING(300), defaultValue: '' },
  paymentScreenshotPath:     { type: DataTypes.STRING(500), defaultValue: '' }

}, {
  tableName: 'registrations',
  timestamps: true,

  hooks: {
    beforeCreate(rec) {

      // 🔥 Generate safe ID
      if (!rec.registrationId) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let id = 'INCO-2K26-';

        for (let i = 0; i < 6; i++) {
          id += chars[Math.floor(Math.random() * chars.length)];
        }

        rec.registrationId = id;
      }

      if (rec.email) {
        rec.email = rec.email.toLowerCase().trim();
      }

      if (!rec.coAuthors) {
        rec.coAuthors = [];
      }
    }
  }
});

// API Shape
Registration.toApiShape = (reg) => {
  if (!reg) return null;

  const d = reg.toJSON();

  return {
    ...d,
    _id: d.id,
    fullName: `${d.salutation} ${d.firstName} ${d.lastName}`,

    paperFile: {
      filename: d.paperFilename,
      originalName: d.paperOriginalName,
      mimetype: d.paperMimetype,
      size: d.paperSize,
      uploadPath: d.paperUploadPath,
    },

    paymentDetails: {
      method: d.paymentMethod,
      transactionId: d.paymentTransactionId,
      amount: d.paymentAmount,
      paidAt: d.paymentPaidAt,
      receiptSent: d.paymentReceiptSent,
      screenshotFile: d.paymentScreenshotFile,
      screenshotOriginal: d.paymentScreenshotOriginal,
      screenshotPath: d.paymentScreenshotPath,
    }
  };
};

module.exports = Registration;
const express = require('express');
const router  = express.Router();

const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

// Protect all admin routes
router.use(protect);

router.get('/dashboard',                    ctrl.getDashboardStats);
router.get('/registrations/export-excel',   ctrl.exportExcel);
router.get('/registrations',                ctrl.getAllRegistrations);
router.get('/registrations/:id/download',   ctrl.downloadPaper);
router.get('/registrations/:id/screenshot', ctrl.viewScreenshot);
router.get('/registrations/:id',            ctrl.getRegistrationById);
router.patch('/registrations/:id/status',   ctrl.updateStatus);

module.exports = router;
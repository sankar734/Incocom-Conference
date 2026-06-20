// const express = require('express');
// const router  = express.Router();
// const { protect } = require('../middleware/auth');
// const ctrl = require('../controllers/adminController');

// router.use(protect);
// router.get('/dashboard',                      ctrl.getDashboardStats);
// router.get('/registrations/export-excel',     ctrl.exportExcel);
// router.get('/registrations',                  ctrl.getAllRegistrations);
// router.get('/registrations/:id',              ctrl.getRegistrationById);
// router.get('/registrations/:id/download',     ctrl.downloadPaper);
// router.get('/registrations/:id/screenshot',   ctrl.viewScreenshot);
// router.patch('/registrations/:id/status',     ctrl.updateStatus);
// module.exports = router;


const express = require('express');
const router  = express.Router();

const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

// Middleware: Protect all admin routes
router.use(protect);

/**
 * Dashboard
 */
router.get('/dashboard', ctrl.getDashboardStats);

/**
 * Export Excel (MAKE SURE FUNCTION EXISTS)
 */
if (ctrl.exportExcel) {
  router.get('/registrations/export-excel', ctrl.exportExcel);
}

/**
 * Registrations
 */
router.get('/registrations', ctrl.getAllRegistrations);

/**
 * IMPORTANT: Place static routes BEFORE dynamic :id
 */
router.get('/registrations/:id/download',   ctrl.downloadPaper);
router.get('/registrations/:id/screenshot', ctrl.viewScreenshot);

/**
 * Get Single Registration
 */
router.get('/registrations/:id', ctrl.getRegistrationById);

/**
 * Update Status
 */
router.patch('/registrations/:id/status', ctrl.updateStatus);

module.exports = router;
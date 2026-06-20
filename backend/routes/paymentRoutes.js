const express = require('express');
const router  = express.Router();
const { uploadScreenshot } = require('../middleware/upload');
const ctrl = require('../controllers/paymentController');

router.get('/details/:registrationId', ctrl.getPaymentDetails);
router.post('/submit', uploadScreenshot, ctrl.submitPayment);
module.exports = router;

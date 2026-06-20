const express = require('express');
const router  = express.Router();
const { uploadPaper } = require('../middleware/upload');
const { submitRegistration, getRegistrationStatus } = require('../controllers/registrationController');

router.post('/submit', uploadPaper, submitRegistration);
router.get('/status/:registrationId', getRegistrationStatus);
module.exports = router;

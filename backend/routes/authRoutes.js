const express = require('express');
const router  = express.Router();
const { adminLogin, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', adminLogin);
router.get('/verify', protect, verifyToken);
module.exports = router;

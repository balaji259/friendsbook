const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post('/send-otp', authController.sendOTP);

router.post('/validate-otp', authController.validateOTP);


router.post('/login',  authController.loginUser);

router.post('/register',  authController.registerUser);


router.post('/verify-key',  authController.verifyKey);

router.post('/check-email', authController.checkEmail);

module.exports = router;

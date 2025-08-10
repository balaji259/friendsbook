const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users'); 
const authMiddleware = require('../middleware/auth'); 
const keyController = require("../controllers/keyController");


router.post('/activate', authMiddleware, keyController.activateKey);


router.post('/deactivate', authMiddleware, keyController.deactivateKey);


module.exports = router;

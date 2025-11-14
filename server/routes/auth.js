// server/routes/auth.js
const express = require('express');
const router = express.Router();

// 1. Import the controller functions
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/authController');

// 2. Define the auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
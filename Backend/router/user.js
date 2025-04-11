/** @format */

const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require('../controller/user');

// Get user profile
router.get('/profile/:userId', getUserProfile);

// Update user profile
router.put('/profile/:userId', updateUserProfile);

// Update profile image
router.put('/profile/:userId/image', updateProfileImage);

// Forgot password - generate reset token
router.post('/forgot-password', forgotPassword);

// Reset password using token
router.post('/reset-password', resetPassword);

// Verify reset token
router.get('/verify-reset-token/:token', verifyResetToken);

module.exports = router;

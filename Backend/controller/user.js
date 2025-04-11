/** @format */

const User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Validate userId parameter
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if userId is a valid ObjectId (to prevent server crash)
    if (
      req.params.userId.length !== 24 &&
      req.params.userId !== 'guest-user-id'
    ) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Find user by ID
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
      details: error.message,
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Validate userId parameter
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if userId is a valid ObjectId (to prevent server crash)
    if (req.params.userId.length !== 24) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Find user by ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.body.imageUrl) user.imageUrl = req.body.imageUrl;

    // If password is provided, hash it
    if (req.body.password && req.body.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save updated user
    const updatedUser = await user.save();

    // Return user without password
    const userResponse = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      imageUrl: updatedUser.imageUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Failed to update user profile',
      details: error.message,
    });
  }
};

// Update user profile image
const updateProfileImage = async (req, res) => {
  try {
    // Validate userId parameter
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if userId is a valid ObjectId (to prevent server crash)
    if (req.params.userId.length !== 24) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Validate image URL
    if (!req.body.imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Find user by ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update image URL
    user.imageUrl = req.body.imageUrl;

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      message: 'Profile image updated successfully',
      imageUrl: updatedUser.imageUrl,
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({
      error: 'Failed to update profile image',
      details: error.message,
    });
  }
};

// Forgot password - generate token and expiry
const forgotPassword = async (req, res) => {
  try {
    // Validate email
    if (!req.body.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ error: 'No account with that email address exists' });
    }

    // Generate random token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiry on user model
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    // Save the user
    await user.save();

    // In a real application, you would send an email with the reset link
    // For this demo, we'll just return the token
    res.json({
      message: 'Password reset token generated successfully',
      token: token,
      // In production, you would not return the token in the response
      // Instead, you would send an email with a link containing the token
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      error: 'Failed to process forgot password request',
      details: error.message,
    });
  }
};

// Reset password using token
const resetPassword = async (req, res) => {
  try {
    // Validate token and new password
    if (!req.body.token || !req.body.password) {
      return res
        .status(400)
        .json({ error: 'Token and new password are required' });
    }

    // Find user with the provided token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Password reset token is invalid or has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the user with new password
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      error: 'Failed to reset password',
      details: error.message,
    });
  }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
  try {
    // Validate token
    if (!req.params.token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Find user with the provided token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Password reset token is invalid or has expired' });
    }

    res.json({ message: 'Token is valid', email: user.email });
  } catch (error) {
    console.error('Error verifying reset token:', error);
    res.status(500).json({
      error: 'Failed to verify reset token',
      details: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};

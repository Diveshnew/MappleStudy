const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Generate Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Your Email is not registered with us',
      });
    }

    // Remove any existing reset token
    await User.findOneAndUpdate(
      { email },
      { token: null, resetPasswordExpires: null }
    );

    // Generate token
    const token = crypto.randomUUID();
    const hashedToken = await bcrypt.hash(token, 10);

    // Update user with hashed token and expiry time
    await User.findOneAndUpdate(
      { email },
      {
        token: hashedToken,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
      },
      { new: true }
    );

    // Create password reset URL
    const url = `http://localhost:5173/update-password/${token}`;

    // Send email
    await mailSender(
      email,
      'Password Reset Link',
      `Reset your password: ${url}`
    );

    return res.status(200).json({
      success: true,
      message:
        'Email sent successfully. Please check your email to reset password.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending reset password email',
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Get user details from db using hashed token
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Compare token with hashed token in DB
    const isTokenValid = await bcrypt.compare(token, user.token);
    if (!isTokenValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and remove token
    await User.findOneAndUpdate(
      { email: user.email },
      { password: hashedPassword, token: null, resetPasswordExpires: null },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while resetting password',
    });
  }
};

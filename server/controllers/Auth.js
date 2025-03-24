const User = require('../models/User');
const Otp = require('../models/Otp');

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    // Fetch email from request body
    const { email } = req.body;

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });

    // If user already exists, then return a response
    if (checkUserPresent) {
      return res.status(409).json({
        success: false,
        message: 'User already registered',
      });
    }

    // Create an OTP entry. The Otp model's pre-save hook will:
    // 1. Generate a secure OTP using crypto.
    // 2. Send the OTP via email.
    // If email sending fails, the OTP won't be saved.
    const otpBody = await Otp.create({ email });
    console.log(otpBody);

    // Return a successful response (note: OTP is not returned in production)
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

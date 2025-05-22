const User = require('../models/User');
const Otp = require('../models/Otp');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const { passwordUpdated } = require('../mail/templates/passwordUpdate');

require('dotenv').config();

// ---------------Send OTP----------------------
exports.sendOtp = async (req, res) => {
  try {
    // Fetch email from request body
    const { email } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email: normalizedEmail });

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
    const otpBody = await Otp.create({ email: normalizedEmail });
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

// -----------------Signup---------------
exports.signUp = async (req, res) => {
  try {
    // Fetch data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Match passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match!',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered',
      });
    }

    // Find the most recent OTP for the user
    const recentOtp = await Otp.find({ email: normalizedEmail })
      .sort({ createdAt: -1 })
      .limit(1);

    // Validate OTP
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.',
      });
    }

    // Compare OTP using bcrypt
    const isOtpValid = await bcrypt.compare(otp, recentOtp[0].otp);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // Return response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'User registration failed. Please try again.',
    });
  }
};

//---------------Login----------------------------
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;
    // validation data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please Fill up All the Required Fields',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // User check exist or not
    const user = await User.findOne({ email: normalizedEmail }).populate(
      'additionalDetails'
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User is not Registered with Us Please SignUp to Continue',
      });
    }
    // generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '2h',
      });
      user.token = token;
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie('token', token, options).status(200).json({
        success: true,
        token,
        user,
        message: 'User Login Success',
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Password is incorret',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Login failure Please try again',
    });
  }
};

// -------------Changing Password----------------
exports.changePassword = async (req, res) => {
  try {
    // 1. Fetch user
    const userDetails = await User.findById(req.user.id);
    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // 2. Pull old/new passwords
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both old and new passwords are required',
      });
    }

    // 3. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect' });
    }

    // 4. Hash & save new password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // 5. Send success response immediately
    res
      .status(200)
      .json({ success: true, message: 'Password updated successfully' });

    // 6. Send email in background
    try {
      await mailSender(
        updatedUser.email,
        'Your password has changed',
        passwordUpdated(
          updatedUser.email,
          `Hello ${updatedUser.firstName}, your password was updated successfully.`
        )
      );
    } catch (err) {
      console.error('Failed to send password-update email:', err);
    }
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while updating password',
      error: error.message,
    });
  }
};

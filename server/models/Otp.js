const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt'); // Now we're using bcrypt for hashing

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // TTL index: 5 minutes
  },
});

// Function to generate a secure 6-digit OTP using crypto
function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
}

// Function to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      'Verification Email from MappleStudy',
      `<h1>Your OTP is: <strong>${otp}</strong></h1>
       <p>This OTP is valid for 5 minutes.</p>`
    );
    console.log('Email sent successfully: ', mailResponse.messageId);
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    throw error;
  }
}

// Pre-save hook: Generate OTP, hash it, send email, and abort save if email sending fails
otpSchema.pre('save', async function (next) {
  try {
    // Generate OTP
    const otp = generateOtp(6);

    // Hash the OTP for secure storage
    const hashedOtp = await bcrypt.hash(otp, 10);
    this.otp = hashedOtp;

    // Attempt to send the plain OTP via email
    await sendVerificationEmail(this.email, otp);
    next();
  } catch (error) {
    console.error('OTP email failed, aborting OTP save.');
    next(error); // Abort save operation if email fails
  }
});

module.exports = mongoose.model('Otp', otpSchema);

const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

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
    expires: 5 * 60, // TTL index (5 minutes)
  },
});

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
    throw error; // Propagate error so that saving can be aborted
  }
}

// Pre-save hook to send OTP email; abort save if email sending fails
otpSchema.pre('save', async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
    next();
  } catch (error) {
    console.error('OTP email failed, aborting OTP save.');
    next(error); // Pass error to abort saving the OTP document
  }
});

module.exports = mongoose.model('Otp', otpSchema);

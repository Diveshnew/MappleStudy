const Razorpay = require('razorpay');

// Create an instance of Razorpay using environment variables
exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

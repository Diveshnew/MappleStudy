// Import required modules and dependencies
const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const mongoose = require('mongoose');
const crypto = require('crypto');
const {
  courseEnrollmentEmail,
} = require('../mail/templates/courseEnrollmentEmail');

// capturePayment: Create a Razorpay order for payment processing
exports.capturePayment = async (req, res) => {
  try {
    // Extract course_id from request body and authenticated user id
    const { course_id } = req.body;
    const userId = req.user.id;

    // Validate: Ensure a valid course ID is provided
    if (!course_id) {
      return res.json({
        success: false,
        message: 'Please provide valid course ID',
      });
    }

    // Validate: Check if the course exists and if student is not already enrolled
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: 'Could not find the course',
        });
      }

      // Instead of converting userId to an ObjectId, compare string values
      if (course.studentsEnrolled.some((id) => id.toString() === userId)) {
        return res.status(200).json({
          success: false,
          message: 'Student is already enrolled',
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // Prepare Razorpay order options (amount in paise)
    const amount = course.price;
    const currency = 'INR';
    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt: Math.random(Date.now()).toString(), // Random receipt; consider a robust method for production
      notes: {
        courseId: course_id,
        userId,
      },
    };

    try {
      // Create a Razorpay order using the provided options
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      // Return payment order details to frontend
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.error(error);
      return res.json({
        success: false,
        message: 'Could not initiate order',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// verifySignature: Verify Razorpay webhook signature and update enrollment accordingly
exports.verifySignature = async (req, res) => {
  // Define webhook secret (in production, store securely in env variables)
  const webhookSecret = '12345678';

  // Extract signature from Razorpay header
  const signature = req.headers['x-razorpay-signature'];

  // Create HMAC digest using sha256 algorithm and the webhook secret
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  // Compare the calculated digest with the received signature
  if (signature === digest) {
    console.log('Payment is Authorised');

    // Destructure courseId and userId from the webhook payload
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // Enroll the student in the course: push user's ObjectId into studentsEnrolled array
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: 'Course not found',
        });
      }

      console.log(enrolledCourse);

      // Add the course to the student’s enrolled courses list
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      // Send enrollment confirmation email to the student (customize template if needed)
      const emailResponse = await mailSender(
        enrolledStudent.email,
        'Congratulations from MappleStudy',
        'Congratulations, you are onboarded into new MappleStudy Course'
      );

      console.log(emailResponse);
      return res.status(200).json({
        success: true,
        message: 'Signature Verified and Course Added',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    // Signature did not match, return error
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
    });
  }
};

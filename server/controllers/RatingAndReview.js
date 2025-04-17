const mongoose = require('mongoose'); // Imported for ObjectId usage in aggregation
const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');

// -------------- Create a new rating & review --------------
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // Validate presence of all required fields
    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Rating, review, and courseId are all required',
      });
    }

    // Ensure student is enrolled in the course
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: userId, // Mongoose will cast userId string to ObjectId internally
    });
    if (!courseDetails) {
      return res.status(403).json({
        success: false,
        message: 'Student is not enrolled in the course',
      });
    }

    // Prevent duplicate reviews by the same user
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        message: 'Course has already been reviewed by this user',
      });
    }

    // Create and save the new review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Push the new review into the course's ratingAndReviews array
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { ratingAndReviews: ratingReview._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Rating and review created successfully',
      data: ratingReview,
    });
  } catch (error) {
    console.error('Error in createRating:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating rating',
    });
  }
};

// -------------- Get average rating for a course --------------
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'courseId is required',
      });
    }

    // Calculate the average rating using aggregation
    const result = await RatingAndReview.aggregate([
      { $match: { course: mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    const averageRating = result.length ? result[0].averageRating : 0;
    const message =
      result.length > 0
        ? 'Average rating calculated successfully'
        : 'No ratings found for this course';

    return res.status(200).json({
      success: true,
      message,
      averageRating,
    });
  } catch (error) {
    console.error('Error in getAverageRating:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while computing average rating',
    });
  }
};

// -------------- Fetch all ratings & reviews --------------
exports.getAllRatings = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: -1 })
      .populate('user', 'firstName lastName email image')
      .populate('course', 'courseName')
      .exec();

    return res.status(200).json({
      success: true,
      message: 'All reviews fetched successfully',
      data: allReviews,
    });
  } catch (error) {
    console.error('Error in getAllRatings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
    });
  }
};
